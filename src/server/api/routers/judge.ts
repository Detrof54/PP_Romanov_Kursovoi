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

    getListYear: publicProcedure
      .query(async ({ ctx, input }) => {
          const seasons = await ctx.db.season.findMany({
              select: { id:true,year: true },
              orderBy: { year: "desc" }, 
          });
  
          return seasons;
      }),

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
    const sorted = [...results].sort((a, b) => {
      if (eventType === "RACE") {
        const ta = a.totalTime ?? Infinity;
        const tb = b.totalTime ?? Infinity;
        return ta - tb;
      }

      const la = a.bestLap ?? Infinity;
      const lb = b.bestLap ?? Infinity;
      return la - lb;
    });

    const resultsData = sorted.map((item, index) => {
      const pozition = index + 1;

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



  updateFullProtocol: publicProcedure
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
            id: z.string().optional(), 
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

    const sorted = [...results].sort((a, b) => {
      if (eventType === "RACE") {
        const ta = a.totalTime ?? Infinity;
        const tb = b.totalTime ?? Infinity;
        return ta - tb;
      }
      const la = a.bestLap ?? Infinity;
      const lb = b.bestLap ?? Infinity;
      return la - lb;
    });

    const resultsData = sorted.map((item, index) => {
      const pozition = index + 1;

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


    await ctx.db.$transaction(async (tx) => {
      for (const data of resultsData) {
        await tx.result.upsert({
          where: {
            pilotId_eventId: {
              pilotId: data.pilotId,
              eventId: eventId,
            },
          },
          update: {
            pozition: data.pozition,
            totalTime: data.totalTime,
            bestLap: data.bestLap,
            points: data.points,
          },
          create: data,
        });
      }

      for (const p of penalties) {
        if (p.id) {
          await tx.penalty.update({
            where: { id: p.id },
            data: {
              reason: p.reason,
              time: p.time,
            },
          });
        } else {
          await tx.penalty.create({
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



  DeleteProtocol: publicProcedure
    .input(
      z.object({
        event_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.penalty.deleteMany({
        where: { eventId: input.event_id },
      });

      await ctx.db.result.deleteMany({
        where: { eventId: input.event_id },
      });

      return { success: true };
    }),



});