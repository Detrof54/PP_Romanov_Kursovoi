import { createTRPCRouter, protectedProcedure } from "../trpc";
import { number, z } from "zod";
import { RaceType } from "@prisma/client";
import { isAdmin } from "~/app/api/auth/check";

export const calendarRouter = createTRPCRouter({
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

      
  getListYear: protectedProcedure
    .query(async ({ ctx, input }) => {
        const seasons = await ctx.db.season.findMany({
            select: { year: true },
            orderBy: { year: "desc" }, 
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
      })
  )
  .mutation(async ({ ctx, input }) => {
    if ( await isAdmin()) throw new Error("Доступ запрещён");
    if (input.dateStart === "") throw new Error("Даты начала этапа нет");
    if (input.dateEnd === "") throw new Error("Даты конца этапа нет");
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
    if ( await isAdmin()) throw new Error("Доступ запрещён");
    return await ctx.db.weekend.update({
      where: { id: input.id },
      data: {
        nameTrassa: input.nameTrassa,
        city: input.city,
        dateStart: new Date(input.dateStart),
        dateEnd: new Date(input.dateEnd),
        events: {
          deleteMany: {}, 
          create: input.events.map((e) => ({
            type: e.type,
            data: new Date(e.data),
          })),
        },
      },
    });
  }),


  deleteWeekend: protectedProcedure
  .input(z.object({ weekendId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    if ( await isAdmin()) throw new Error("Доступ запрещён");
    await ctx.db.weekend.delete({
      where: { id: input.weekendId },
    });
  }),


 
  getListYearRead: protectedProcedure
    .query(async ({ ctx }) => {
    const seasons = await ctx.db.season.findMany({
      select: { id: true, year: true }, 
      orderBy: { year: "desc" },
    });
    return seasons; 
  }),

  createSeason: protectedProcedure
    .input(z.object({ year: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if ( await isAdmin()) throw new Error("Доступ запрещён");
      return ctx.db.season.create({ data: { year: input.year } });
    }),

  updateSeason: protectedProcedure
    .input(z.object({ id: z.string(), year: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if ( await isAdmin()) throw new Error("Доступ запрещён");
      return ctx.db.season.update({
        where: { id: input.id },
        data: { year: input.year },
      });
    }),

  deleteSeason: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if ( await isAdmin()) throw new Error("Доступ запрещён");
      await ctx.db.season.update({
        where: { id: input.id },
        data: {
          pilots: {
            set: [] 
          }
        }
      });
    return ctx.db.season.delete({ where: { id: input.id } });
  }),

});
