import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { getId } from "~/app/api/auth/check";

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



  updateBaseProfile: publicProcedure
  .input(
    z.object({
      id: z.string(),
      firstname: z.string().min(1).nullable(),
      surname: z.string().min(1).nullable(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    if ( await getId() === input.id) throw new Error("Доступ запрещён");
    return ctx.db.user.update({
      where: { id: input.id },
      data: {
        firstname: input.firstname,
        surname: input.surname,
      },
    });
  }),

  updatePilotProfile: publicProcedure
  .input(
    z.object({
      id_pilot: z.string(),
      license: z.string().nullable(),
      birthDate: z.date(),
      start_number: z.number().int(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const data = {license: input.license, birthDate: input.birthDate, start_number: input.start_number}

    return ctx.db.pilot.update({
      where: { id: input.id_pilot },
      data: data,  
    });
  }),

  deleteProfile: publicProcedure
  .input(
    z.object({
      id_user: z.string(),
      id_pilot: z.string().optional(),
      id_judge: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    if ( await getId() === input.id_user) throw new Error("Доступ запрещён");
    const { id_user, id_pilot, id_judge } = input;
      await ctx.db.$transaction(async (tx) => {
      if (id_pilot) {
        await tx.penalty.deleteMany({
          where: { pilotId: id_pilot },
        });

        await tx.pilot.delete({
          where: { id: id_pilot },
        });
      }

      if (id_judge) {
        await tx.penalty.deleteMany({
          where: { judgeId: id_judge },
        });

        await tx.judge.delete({
          where: { id: id_judge },
        });
      }

      await tx.user.delete({
        where: { id: id_user },
      });
    });

    return { success: true };
}),




});