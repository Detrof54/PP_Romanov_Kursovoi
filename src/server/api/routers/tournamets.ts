import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { number, z } from "zod";
import { isAdmin, isOrganizer, isOrganizerOwner } from "~/app/api/auth/check";
import { TypeStage } from "@prisma/client";

export const tournametsRouter = createTRPCRouter({
  //Получения списка турниров
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

  //получение одного турнира выбранного
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
              include: {
                result: true,
                playerA: {
                  include: {
                    participant: true,
                  },
                },
                playerB: {
                  include: {
                    participant: true,
                  },
                },
              },
            },
          }
        },
        brackets: {
          include:{
            matches: {
              include: {
                result: true,
                playerA: {
                  include: {
                    participant: true,
                  },
                },
                playerB: {
                  include: {
                    participant: true,
                  },
                },
              },
            },
          }
        },
      }
    });
  }),

  //удаление турнира
  deleteTournament: protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const tournament = await ctx.db.turnir.findUnique({
      where: { id: input.id },
    }); 
    if (!tournament) throw new TRPCError({code: "NOT_FOUND",message: "Турнир не найден",});
    if(!(await (isAdmin() || isOrganizerOwner(tournament?.createdById)))) throw new TRPCError({code: "FORBIDDEN",message: "Нет прав",});

    await ctx.db.turnir.delete({
      where: { id: input.id },
    });

    return { success: true };
  }),


  createTournament: protectedProcedure
  .input(
    z.object({
      nameTurnir: z.string().min(1),
      description: z.string().optional(),
      groupsCount: z.number().min(1),
      tiebreakType: z.enum(["POINTS", "HEAD_TO_HEAD", "SCORE_DIFF"]),
    })
  )
  .mutation(async ({ ctx, input }) => {
    if(!(await (isAdmin() || isOrganizer()))) throw new TRPCError({code: "FORBIDDEN",message: "Нет прав",});

    return ctx.db.turnir.create({
      data: {
        nameTurnir: input.nameTurnir,
        description: input.description,
        stage: TypeStage.GROUP,
        participantsCount: 0,
        groupsCount: input.groupsCount,
        tiebreakType: input.tiebreakType,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: ctx.session.user.id,
      },
    });
  }),

  //получение участников
  getParticipants: protectedProcedure
  .query(async ({ ctx }) => {
    return ctx.db.participant.findMany({});
  }),

  //добавление участников турнира
  createTurnirParticipant: protectedProcedure
    .input(
      z.object({
        idTournir: z.string(),
        idParcipants: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { idTournir, idParcipants } = input;

      // 1️⃣ Проверяем турнир
      const tournir = await ctx.db.turnir.findUnique({
        where: { id: idTournir },
        include: {
          participants: true, // TurnirParticipant[]
        },
      });

      if (!tournir) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Турнир не найден",
        });
      }

      // 2️⃣ Проверка прав
      if (
        !(await isAdmin()) &&
        !(await isOrganizerOwner(tournir.createdById))
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Нет прав",
        });
      }

      // 3️⃣ Проверяем что Participant существуют
      const realParticipants = await ctx.db.participant.findMany({
        where: {
          id: { in: idParcipants },
        },
      });

      if (realParticipants.length !== idParcipants.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Некоторые участники не найдены",
        });
      }

      // 4️⃣ Проверяем кто уже добавлен
      const existingIds = tournir.participants
        .map((tp) => tp.participantId)
        .filter(Boolean) as string[];

      const newIds = idParcipants.filter(
        (id) => !existingIds.includes(id)
      );

      if (newIds.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Все участники уже добавлены",
        });
      }

      // 5️⃣ Создаем записи в TurnirParticipant
      await ctx.db.$transaction([
        ctx.db.turnirParticipant.createMany({
          data: newIds.map((participantId) => ({
            tournamentId: idTournir,
            participantId,
          })),
          skipDuplicates: true, // защита от @@unique
        }),

        ctx.db.turnir.update({
          where: { id: idTournir },
          data: {
            participantsCount: {
              increment: newIds.length,
            },
          },
        }),
      ]);

      return { success: true };
    }),

  //обновление турнира
  updateTournir: protectedProcedure
  .input(
    z.object({
      idTournir: z.string(),
      nameTurnir: z.string(),
      description: z.string().nullable(),
      groupsCount: z.number(),
      tiebreakType: z.enum(["POINTS", "HEAD_TO_HEAD", "SCORE_DIFF"]),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const {idTournir,nameTurnir,description,groupsCount,tiebreakType} = input;

    const tournir = await ctx.db.turnir.findUnique({
      where: { id: idTournir },
      include: {
        groups: true,
      },
    });

    if (!tournir) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Турнир не найден",
      });
    }

    // ✅ Проверка прав
    const admin = await isAdmin();
    const owner = await isOrganizerOwner(tournir.createdById);

    if (!admin && !owner) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Нет прав",
      });
    }

    // ✅ Запрет если уже созданы группы
    if (tournir.groups.length > 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Нельзя редактировать — группы уже созены",
      });
    }

    // ✅ Обновляем только поля турнира
    await ctx.db.turnir.update({
      where: { id: idTournir },
      data: {
        nameTurnir,
        description,
        groupsCount,
        tiebreakType,
      },
    });

    return { success: true };
  }),

});
