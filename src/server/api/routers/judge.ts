import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const judgesRouter = createTRPCRouter({
  getJudges: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.judge.findMany({
      include: {
        user: true,
      },
    });
  }),

      //получение списка сезонов (годов)
    getListYear: publicProcedure
      .query(async ({ ctx, input }) => {
          const seasons = await ctx.db.season.findMany({
              select: { id:true,year: true },
              orderBy: { year: "desc" }, // чтобы список шёл по убыванию
          });
  
          return seasons;
      }),

  //получение списка этапов по году
  getListWeekends: publicProcedure
    .input(
      z.object({
        year: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const currentDate = new Date().getFullYear();
      const year = input.year ? input.year : currentDate
        return ctx.db.season.findFirst({
          where: { year: year },
          include: {
            weekend: {
              include: {
                events: {
                 include: {
                  results: {
                    include: {
                      driver: {
                        include: {
                          user: true, // ← Добавьте эту строку
                        },
                      },
                    },
                  orderBy: { pozition: "asc" },
                  },
                  penalties: true,
                },
              },
            },
          },
        }});
    }),

  //получаем нужный этап
  // getRezultWeekend: publicProcedure
  // .input(z.object({ 
  //   year: z.number(),
  //   stage: z.number(), 
  // }))
  // .query(async ({ ctx, input }) => {
  //   const currentDate = new Date().getFullYear();
  //   const year = input.year ? input.year : currentDate

  //   const weekend = await ctx.db.weekend.findFirst({
  //     where: {
  //       stage: input.stage,
  //       season: {
  //         year: year
  //       }
  //     },
  //     include: {
  //       season: {
  //         select: {
  //           year: true,
  //           isActive: true
  //         }
  //       },
  //       events: {
  //         include: {
  //           results: true,
  //           penalties: true,
  //         },
  //       },
  //     }
  // });
  //   return weekend;
  // }),
});