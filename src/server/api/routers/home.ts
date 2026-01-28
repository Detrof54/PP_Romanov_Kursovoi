import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const homeRouter = createTRPCRouter({
  // getCurrentWeekend: protectedProcedure.query(async ({ ctx }) => {
  //   const now = new Date();

  //   const from = new Date(now);
  //   from.setDate(from.getDate() - 1);

  //   const to = new Date(now);
  //   to.setDate(to.getDate() + 1);

  //   const weekend = await ctx.db.weekend.findFirst({
  //     where: {
  //       dateStart: { lte: to },
  //       dateEnd: { gte: from },
  //     },
  //     include: {
  //       events: true,
  //       season: true,
  //     },
  //     orderBy: { dateStart: "asc" },
  //   });

  //   return weekend;
  // }),

  getParticipants: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.participant.findMany({
      include: {
        tournaments: {
          include: {
            tournament: true,
            groupMatchesAsA: true,
            groupMatchesAsB: true,
            bracketMatchesAsA: true,
            bracketMatchesAsB: true,
          },
        },
      },
    });
  }),



});