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
});