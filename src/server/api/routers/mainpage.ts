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

});