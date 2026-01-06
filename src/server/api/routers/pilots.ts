import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const pilotsRouter = createTRPCRouter({
    getTablePilots: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.pilot.findMany({
        include: {
          user: {
            select: {
              firstname: true,
              surname: true,
              image: true,
            },
          },
          results: true,
          penalties: true,
          seasons: true,
        },
      });
    }),
    getPilots: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.pilot.findMany({
        include: {
          user: {
            select: {
              firstname: true,
              surname: true,
              image: true,
            },
          },
        },
      });
    }),
    
})