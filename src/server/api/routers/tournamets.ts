import { createTRPCRouter, protectedProcedure } from "../trpc";
import { number, z } from "zod";
import { isAdmin } from "~/app/api/auth/check";

export const tournametsRouter = createTRPCRouter({
  getTurnirs: protectedProcedure
  .query(async ({ ctx }) => {
    return ctx.db.turnir.findMany({
      select: {
        id: true,
        nameTurnir: true,
        stage: true,
        participantsCount: true,
        createdAt: true,
        createdBy: {
          select: {
            id: true,
            firstname:true,
            surname: true,
          }
        },
      },
    });
  }),

  getTurnir: protectedProcedure
  .input(z.object({
    idTournir: z.string(),
  }))
  .query(async ({ ctx,input }) => {
    return ctx.db.turnir.findFirst({
      where: {
        id: input.idTournir,
      },
      include: {
        createdBy: {
          select:{
            id: true,
            firstname: true,
            surname: true,
            email: true,
            role: true,
          }
        },
        participants: {
          include:{
            participant: true,
          }
        },
        groups: {
          include:{
            participants: {
              include:{
                participant: true,
              }
            },
            matches: {
              include:{
                result: true,
              }
            },
          }
        },
        brackets: {
          include:{
            matches: true,
          }
        },
      }
    });
  }),


});
