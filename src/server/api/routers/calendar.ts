import { createTRPCRouter, protectedProcedure } from "../trpc";
import { number, z } from "zod";
import { RaceType } from "@prisma/client";

export const calendarRouter = createTRPCRouter({
  //получение списка викендов (этапов)
  getListWeekends: protectedProcedure
    .input(
      z.object({
        year: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
        return ctx.db.season.findFirst({
          where: { year: input.year },
          include: {
            weekend: {
              include: {
                events: true,
              },
            },
          },
        });
    }),

    //получение списка сезонов (годов)
    getListYear: protectedProcedure
    .query(async ({ ctx, input }) => {
        const seasons = await ctx.db.season.findMany({
            select: { year: true },
            orderBy: { year: "desc" }, // чтобы список шёл по убыванию
        });

        return seasons.map((s) => s.year);
    }),

createWeekend: protectedProcedure
  .input(
    z.object({
      seasonId: z.string(),
      stage: z.number(),
      nameTrassa: z.string(),
      city: z.string(),
      dateStart: z.string(),
      dateEnd: z.string(),
      events: z
        .array(
          z.object({
            type: z.enum(["TEST_RACE", "QUALIFICATION", "RACE"]),
            data: z.string(),
          })
        )
        .max(3),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const user = ctx.session?.user;
    if (user?.role !== "ADMIN") throw new Error("Доступ запрещён");
    if (input.dateStart !== "") throw new Error("Даты начала этапа нет");
    if (input.dateEnd !== "") throw new Error("Даты конца этапа нет");
    const weekend = await ctx.db.weekend.create({
      data: {
        seasonId: input.seasonId,
        stage: input.stage,
        nameTrassa: input.nameTrassa,
        city: input.city,
        dateStart: new Date(input.dateStart),
        dateEnd: new Date(input.dateEnd),
        events: {
          create: input.events.map(ev => ({
            type: ev.type as RaceType,
            data: new Date(ev.data),
          })),
        },
      },
      include: { events: true },
    });

    return weekend;
  }),
  updateWeekend: protectedProcedure
  .input(z.object({
    id: z.string(),
    nameTrassa: z.string(),
    city: z.string(),
    dateStart: z.string(),
    dateEnd: z.string(),
    events: z.array(
      z.object({
        type: z.enum(["TEST_RACE", "QUALIFICATION", "RACE"]),
        data: z.string(),
      })
    ),
  }))
  .mutation(async ({ ctx, input }) => {
    return await ctx.db.weekend.update({
      where: { id: input.id },
      data: {
        nameTrassa: input.nameTrassa,
        city: input.city,
        dateStart: input.dateStart,
        dateEnd: input.dateEnd,
        events: {
          deleteMany: {}, // удаляем старые события
          create: input.events.map((e) => ({
            type: e.type,
            data: e.data,
          })),
        },
      },
    });
  }),
  deleteWeekend: protectedProcedure
  .input(z.object({ weekendId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    await ctx.db.weekend.delete({
      where: { id: input.weekendId },
    });
  }),


  //CRUD для сезонов
  getListYearRead: protectedProcedure
    .query(async ({ ctx }) => {
    return ctx.db.season.findMany({
      select: { year: true },
      orderBy: { year: "desc" },
    }).then((res) => res.map(r => r.year));
  }),

createSeason: protectedProcedure
  .input(z.object({ year: z.number() }))
  .mutation(async ({ ctx, input }) => {
    return ctx.db.season.create({ data: { year: input.year } });
  }),

updateSeason: protectedProcedure
  .input(z.object({ id: z.string(), year: z.number() }))
  .mutation(async ({ ctx, input }) => {
    return ctx.db.season.update({
      where: { id: input.id },
      data: { year: input.year },
    });
  }),

deleteSeason: protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    return ctx.db.season.delete({ where: { id: input.id } });
  }),

});
