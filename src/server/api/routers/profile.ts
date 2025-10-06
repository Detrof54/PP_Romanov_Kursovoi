import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const userProfileRouter = createTRPCRouter({
  getUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findUnique({
        where: { id: input.id },
        include: {
          pilot: {
            include: {
              penalties: true,
            },
          },
          judge: {
            include: {
              penalties: true,
            },
          },
        },
      });
    }),
});