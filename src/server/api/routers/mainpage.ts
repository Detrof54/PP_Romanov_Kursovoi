import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const mainPageRouter = createTRPCRouter({
  getCurrentWeekend: protectedProcedure.query(async ({ ctx }) => {
    // Получаем ближайший уикенд, например по дате начала
    const weekend = await ctx.db.weekend.findFirst({
      where: {
        dateStart: { lte: new Date() },
        dateEnd: { gte: new Date() }, // текущий уикенд
      },
      include: {
        events: true,
        season: true, // добавляем связь с сезоном
      },
      orderBy: { dateStart: "asc" },
    });
    return weekend;
  }),

  // getPreviousWeekend: protectedProcedure.query(async ({ctx}) => {
  //   const weekend = await ctx.db.weekend.findFirst({
  //     where: {
  //       dateEnd: { lt: new Date()}, // до декущего викенд 
  //     },
  //     include: {
  //       events: true,
  //       season: true, // добавляем связь с сезоном
  //     },
  //     orderBy: {  dateEnd: "desc"}, // выбираем последний
  //   });
  //   return weekend;
  // }),

  // getNextWeekend: protectedProcedure.query(async ({ctx}) => {
  //     const weekend = await ctx.db.weekend.findFirst({
  //       where: {
  //         dateEnd: { gt: new Date()}, // до декущего викенд 
  //       },
  //       include: {
  //         events: true,
  //         season: true, // добавляем связь с сезоном
  //       },
  //       orderBy: {  dateEnd: "asc"}, // выбираем последний
  //     });
  //     return weekend;
  // }),


  getWeekendOverview: protectedProcedure.query(async ({ ctx }) => {
  const now = new Date();

  const [previous, next] = await Promise.all([
      ctx.db.weekend.findFirst({
        where: { dateEnd: { lt: now } },
        include: { events: true, season: true },
        orderBy: { dateEnd: "desc" },
      }),

      ctx.db.weekend.findFirst({
        where: { dateStart: { gt: now } },
        include: { events: true, season: true },
        orderBy: { dateStart: "asc" },
      }),
    ]);

    return { previous, next };
  }),

  getNewsData: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();

    const day = now.getDay(); 
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const news = await ctx.db.news.findMany({
      where: {
        date: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      orderBy: { date: "desc" },
    });

    const formatted = news.map((n) => ({
      id: n.id,
      title: n.title,
      summary: n.summary,
      date: n.date.toISOString(),
      image: n.image
    ? `data:image/webp;base64,${Buffer.from(n.image).toString("base64")}`
    : null,
    }));

    return formatted;

  }),

  // создание новости
  addNews: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        summary: z.string(),
        date: z.string(), 
        imageBase64: z.string().optional(), 
      })
    )
    .mutation(async ({ input, ctx }) => {
      const buffer = input.imageBase64 ? Buffer.from(input.imageBase64, "base64") : undefined;

      const news = await ctx.db.news.create({
        data: {
          title: input.title,
          summary: input.summary,
          date: new Date(input.date),
          image: buffer,
        },
      });

      return news;
    }),

  // Обновление новости
  updateNews: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        summary: z.string().optional(),
        date: z.string().optional(),
        imageBase64: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const buffer = input.imageBase64 ? Buffer.from(input.imageBase64, "base64") : undefined;

      const news = await ctx.db.news.update({
        where: { id: input.id },
        data: {
          title: input.title,
          summary: input.summary,
          date: input.date ? new Date(input.date) : undefined,
          image: buffer,
        },
      });

      return news;
    }),

  //Удаление новости
  deleteNews: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.news.delete({ where: { id: input.id } });
      return { success: true };
    }),

});