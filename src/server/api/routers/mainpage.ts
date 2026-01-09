import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const mainPageRouter = createTRPCRouter({

  
getCurrentWeekend: protectedProcedure.query(async ({ ctx }) => {
  const now = new Date();

  const from = new Date(now);
  from.setDate(from.getDate() - 1);

  const to = new Date(now);
  to.setDate(to.getDate() + 1);

  const weekend = await ctx.db.weekend.findFirst({
    where: {
      dateStart: { lte: to },
      dateEnd: { gte: from },
    },
    include: {
      events: true,
      season: true,
    },
    orderBy: { dateStart: "asc" },
  });

  return weekend;
}),

  // getCurrentWeekend: protectedProcedure.query(async ({ ctx }) => {
  //   const now = new Date();

  //   const startOfWeek = new Date(now);
  //   const day = startOfWeek.getDay(); 
  //   const diff = day === 0 ? -6 : 1 - day;
  //   startOfWeek.setDate(startOfWeek.getDate() + diff);
  //   startOfWeek.setHours(0, 0, 0, 0);

  //   const endOfWeek = new Date(startOfWeek);
  //   endOfWeek.setDate(endOfWeek.getDate() + 6);
  //   endOfWeek.setHours(23, 59, 59, 999);

  //   const from = new Date(startOfWeek);
  //   from.setDate(from.getDate() - 1);

  //   const to = new Date(endOfWeek);
  //   to.setDate(to.getDate() + 1);

  //   const weekend = await ctx.db.weekend.findFirst({
  //     where: {
  //       dateStart: {
  //         gte: from,
  //         lte: to,
  //       },
  //       dateEnd: {
  //         gte: from,
  //         lte: to,
  //       },
  //     },
  //     include: {
  //       events: true,
  //       season: true,
  //     },
  //     orderBy: {
  //       dateStart: "asc",
  //     },
  //   });

  //   return weekend;
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
  }),

});