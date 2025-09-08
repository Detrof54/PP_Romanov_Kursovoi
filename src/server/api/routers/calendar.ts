import { createTRPCRouter, protectedProcedure } from "../trpc";
import { number, z } from "zod";

export const calendarRouter = createTRPCRouter({
  getListWeekends: protectedProcedure
    .input(
      z.object({
        year: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.year) {
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
      }

      return ctx.db.season.findFirst({
        where: { isActive: true },
        include: {
          weekend: {
            include: {
              events: true,
            },
          },
        },
      });
    }),
    getListYear: protectedProcedure
    .query(async ({ ctx, input }) => {
        const seasons = await ctx.db.season.findMany({
            select: { year: true },
            orderBy: { year: "desc" }, // чтобы список шёл по убыванию
        });

        return seasons.map((s) => s.year);
    })
});
