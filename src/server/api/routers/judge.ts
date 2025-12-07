import { create } from "domain";
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
                          user: true, 
                        },
                      },
                    },
                  orderBy: { pozition: "asc" },
                  },
                  penalties:  {
                    include: {
                      pilot: {
                        include: {
                          user: true, 
                        },
                      }, 
                    },
                  }
                },
              },
            },
          },
        }});
    }),


    
  //получаем нужный этап
  getCurrentWeekend: publicProcedure
  .input(z.object({ 
    year: z.number().optional(),
    stage: z.number().optional(), 
  }))
  .query(async ({ ctx, input }) => {
    const currentDate = new Date().getFullYear();
    const year = input.year ? input.year : currentDate
    const now = new Date();
    const nowMinus3Days = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);


    const weekend = await ctx.db.weekend.findFirst({
      where: {
        season: {year: year},
        ...(input.stage ? { stage: input.stage } : 
          {                      
            dateStart: { lte: now },
            dateEnd: { gte: nowMinus3Days },
          }
        ),
      },
      include: {
        season: {
          select: {
            year: true,
            isActive: true,
            pilots:  {include: {
              user: {select: {
                  surname: true,
                  firstname: true
              }},
            }}
          }
        },
        events: {
          include: {
            results: {
              include: {
                driver: {
                  include: {
                    user:true
                  }
                }, 
              },
            },
            penalties: {
              include: {
                pilot: {
                  include: {
                    user:true
                  }
                }, 
              },
            },
          },
        },
      }
  });
    return weekend;
  }),


createFullProtocol: publicProcedure
  .input(
    z.object({
      eventId: z.string(),
      judgeId: z.string(),
      eventType: z.enum(["TEST_RACE", "QUALIFICATION", "RACE"]),
      results: z.array(
        z.object({
          pilotId: z.string(),
          bestLap: z.number().nullable(),
          totalTime: z.number().nullable(),
        })
      ),
      penalties: z
        .array(
          z.object({
            pilotId: z.string(),
            reason: z.string(),
            time: z.number(),
          })
        )
        .optional()
        .default([]),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { eventId, judgeId, results, penalties, eventType } = input;
    // --- 1. Сортировка по типу заезда ---
    const sorted = [...results].sort((a, b) => {
      if (eventType === "RACE") {
        // ГОНКА — сортируем по totalTime
        const ta = a.totalTime ?? Infinity;
        const tb = b.totalTime ?? Infinity;
        return ta - tb;
      }

      // ТРЕНИРОВКА / КВАЛИФИКАЦИЯ — сортируем по bestLap
      const la = a.bestLap ?? Infinity;
      const lb = b.bestLap ?? Infinity;
      return la - lb;
    });

    // --- 2. Формируем данные результатов ---
    const resultsData = sorted.map((item, index) => {
      const pozition = index + 1;

      // ТОЛЬКО гонка начисляет очки
      const points =
        eventType === "RACE"
          ? Math.max(25 - (pozition - 1) * 2, 0)
          : 0;

      return {
        pilotId: item.pilotId,
        eventId,
        pozition,
        totalTime: item.totalTime ?? 0,
        bestLap: item.bestLap ?? null,
        points,
      };
    });

    // --- 3. Запись в БД ---
    await ctx.db.$transaction(async (tx) => {
      for (const data of resultsData) {
        await tx.result.create({ data });
      }

      if (penalties.length > 0) {
        for (const p of penalties) {
          await ctx.db.penalty.create({
            data: {
              pilotId: p.pilotId,
              eventId,
              judgeId,
              reason: p.reason,
              time: p.time,
            },
          });
        }
      }
    });

    return { status: "ok" };
  }),



  //обновление протокола (результата)

  //удаления протокола (результата)
  DeleteProtocol: publicProcedure
    .input(
      z.object({
        event_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Удаляем штрафы
      await ctx.db.penalty.deleteMany({
        where: { eventId: input.event_id },
      });

      // Удаляем результаты
      await ctx.db.result.deleteMany({
        where: { eventId: input.event_id },
      });

      return { success: true };
    }),


  //админские возможности CRUD над результатами


});