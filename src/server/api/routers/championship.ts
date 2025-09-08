import { createTRPCRouter, protectedProcedure } from "../trpc";
import { number, z } from "zod";

export const championshipRouter = createTRPCRouter({
    getTablePersonalCreditChempionship: protectedProcedure
    .input(
        z.object({
        year: z.number().optional(),
        }),
    )
    .query(async ({ ctx, input }) => {
        const seasonFilter = input.year
        ? { year: input.year }
        : { isActive: true };

        return ctx.db.season.findFirst({
        where: seasonFilter,
        include: {
            pilots: {
            include: {
                results: true,   // результаты пилота
                penalties: true, // штрафы пилота
                user: {
                select: {
                    firstname: true,
                    surname: true,
                },
                },
            },
            },
        },
        });
    }),
    getListYearBeforeCurrent: protectedProcedure
    .query(async ({ ctx }) => {
        // находим текущий сезон
        const currentSeason = await ctx.db.season.findFirst({
        where: { isActive: true },
        select: { year: true },
        });

        if (!currentSeason) {
        return []; // если активного сезона нет
        }

        // достаем все сезоны до текущего включительно
        const seasons = await ctx.db.season.findMany({
        where: {
            year: { lte: currentSeason.year }, // <= текущий
        },
        select: { year: true },
        orderBy: { year: "desc" },
        });

        return seasons.map((s) => s.year);
    }),
})