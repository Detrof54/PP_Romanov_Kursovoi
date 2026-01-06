import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const mainPageRouter = createTRPCRouter({
  getCurrentWeekend: protectedProcedure.query(async ({ ctx }) => {
    const weekend = await ctx.db.weekend.findFirst({
      where: {
        dateStart: { lte: new Date() },
        dateEnd: { gte: new Date() }, 
      },
      include: {
        events: true,
        season: true, 
      },
      orderBy: { dateStart: "asc" },
    });
    return weekend;
  }),


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