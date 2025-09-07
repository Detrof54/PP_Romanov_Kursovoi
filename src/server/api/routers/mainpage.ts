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

  const [previous, current, next] = await Promise.all([
      ctx.db.weekend.findFirst({
        where: { dateEnd: { lt: now } },
        include: { events: true, season: true },
        orderBy: { dateEnd: "desc" },
      }),
      ctx.db.weekend.findFirst({
        where: { dateStart: { lte: now }, dateEnd: { gte: now } },
        include: { events: true, season: true },
        orderBy: { dateStart: "asc" },
      }),
      ctx.db.weekend.findFirst({
        where: { dateStart: { gt: now } },
        include: { events: true, season: true },
        orderBy: { dateStart: "asc" },
      }),
    ]);

    return { previous, current, next };
  }),

});