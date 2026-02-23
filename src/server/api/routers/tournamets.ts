import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { number, z } from "zod";
import { isAdmin, isOrganizer, isOrganizerOwner } from "~/app/api/auth/check";
import { TiebreakType, TypeStage } from "@prisma/client";

export const tournametsRouter = createTRPCRouter({
//ПОЛУЧЕНИЕ СПИСКА ТУРНИРОВ
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

//ПОЛУЧЕНИЕ ТУРНИРА
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

//УДАЛЕНИЕ ТУРНИРА
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

//СОЗДАНИЕ ТУРНИРА
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

//ПОЛУЧЕНИЕ СПИСКА УЧАСТНИКОВ
  getParticipants: protectedProcedure
  .query(async ({ ctx }) => {
    return ctx.db.participant.findMany({});
  }),

//ДОБАВЛЕНИЕ УЧАСТНИКОВ В ТУРНИР
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

//ОБНОВЛЕНИЕ ТУРНИРА
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


//СОЗДАНИЕ ГРУПП
  createGroups: protectedProcedure
  .input(
    z.object({
      idTournir: z.string(),
      groups: z.array(
        z.object({
          name: z.string(),
          participantIds: z.array(z.string()),
        })
      ),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { idTournir, groups } = input;

    const tournir = await ctx.db.turnir.findUnique({
      where: { id: idTournir },
      include: { groups: true },
    });

    if (!tournir) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Турнир не найден",
      });
    }

    if (tournir.groups.length > 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Группы уже созданы",
      });
    }

    await ctx.db.$transaction(async (tx) => {
      for (const group of groups) {
        // 1️⃣ создаем группу
        const createdGroup = await tx.group.create({
          data: {
            name: group.name,
            tournamentId: idTournir,
          },
        });

        // 2️⃣ привязываем участников к группе
        await tx.turnirParticipant.updateMany({
          where: {
            id: { in: group.participantIds },
          },
          data: {
            groupId: createdGroup.id,
          },
        });
      }
    });
    return { success: true };
  }),

//СОЗДАНИЕ МАТЧЕЙ ДЛЯ ГРУПП
createGroupMatches: protectedProcedure
  .input(
    z.object({
      idTournir: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { idTournir } = input;

    const tournir = await ctx.db.turnir.findUnique({
      where: { id: idTournir },
      include: {
        groups: {
          include: {
            participants: true,
            matches: true,
          },
        },
      },
    });

    if (!tournir) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Турнир не найден",
      });
    }

    if (tournir.groups.length === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Группы не созданы",
      });
    }

    // 🚫 Проверка на повторную генерацию
    const matchesExist = tournir.groups.some(
      (g) => g.matches.length > 0
    );

    if (matchesExist) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Матчи уже созданы",
      });
    }

    await ctx.db.$transaction(async (tx) => {
      for (const group of tournir.groups) {
        const players = group.participants;

        if (players.length < 2) continue;

        // ===============================
        // 1️⃣ Генерируем все пары
        // ===============================

        const pairs: {
          a: typeof players[number];
          b: typeof players[number];
        }[] = [];

        for (let i = 0; i < players.length; i++) {
          for (let j = i + 1; j < players.length; j++) {
            const playerA = players[i];
            const playerB = players[j];

            if (!playerA || !playerB) continue;

            pairs.push({
              a: playerA,
              b: playerB,
            });
          }
        }

        // ===============================
        // 2️⃣ Распределяем по раундам
        // ===============================

        let remainingPairs = pairs;

        const rounds: typeof pairs[] = [];

        while (remainingPairs.length > 0) {
          const round: typeof pairs = [];
          const usedPlayers = new Set<string>();
          const nextRemaining: typeof pairs = [];

          for (const match of remainingPairs) {
            if (
              !usedPlayers.has(match.a.id) &&
              !usedPlayers.has(match.b.id)
            ) {
              round.push(match);
              usedPlayers.add(match.a.id);
              usedPlayers.add(match.b.id);
            } else {
              nextRemaining.push(match);
            }
          }

          rounds.push(round);
          remainingPairs = nextRemaining;
        }

        // ===============================
        // 3️⃣ Сохраняем в БД
        // ===============================

        for (const [roundIndex, roundMatches] of rounds.entries()) {
          for (const match of roundMatches) {
            await tx.groupMatch.create({
              data: {
                round: roundIndex + 1,
                playerAId: match.a.id,
                playerBId: match.b.id,
                groupId: group.id,
              },
            });
          }
        }
      }
    });

    return { success: true };
  }),

//СОЗДАНИЕ РЕЗУЛЬТАТОВ ГРУППОВЫХ МАТЧЕЙ с изменением статистики
  setMatchResult: protectedProcedure
  .input(z.object({
    matchId: z.string(),
    scoreA: z.number(),
    scoreB: z.number(),
  }))
  .mutation(async ({ ctx, input }) => {

    return await ctx.db.$transaction(async (tx) => {

      const match = await tx.groupMatch.findUnique({
        where: { id: input.matchId },
      });

      if (!match) throw new Error("Матч не найден");
      if (match.status === "FINISHED")
        throw new Error("Матч уже завершён");

      let winnerId = null;
      if (input.scoreA > input.scoreB) winnerId = match.playerAId;
      if (input.scoreB > input.scoreA) winnerId = match.playerBId;

      // 1️⃣ Создаём результат
      await tx.groupMatchResult.create({
        data: {
          scoreA: input.scoreA,
          scoreB: input.scoreB,
          winnerId,
          groupMatch: {
            connect: { id: match.id }
          }
        }
      });

      // 2️⃣ Обновляем матч
      await tx.groupMatch.update({
        where: { id: match.id },
        data: { status: "FINISHED" }
      });

      // 3️⃣ Обновляем статистику игрока A
      await tx.turnirParticipant.update({
        where: { id: match.playerAId },
        data: {
          scoreFor: { increment: input.scoreA },
          scoreAgainst: { increment: input.scoreB },
          wins: input.scoreA > input.scoreB ? { increment: 1 } : undefined,
          defeat: input.scoreA < input.scoreB ? { increment: 1 } : undefined,
          points:
            input.scoreA > input.scoreB
              ? { increment: 3 }
              : input.scoreA === input.scoreB
              ? { increment: 1 }
              : undefined,
        }
      });

      // 4️⃣ Обновляем статистику игрока B
      await tx.turnirParticipant.update({
        where: { id: match.playerBId },
        data: {
          scoreFor: { increment: input.scoreB },
          scoreAgainst: { increment: input.scoreA },
          wins: input.scoreB > input.scoreA ? { increment: 1 } : undefined,
          defeat: input.scoreB < input.scoreA ? { increment: 1 } : undefined,
          points:
            input.scoreB > input.scoreA
              ? { increment: 3 }
              : input.scoreA === input.scoreB
              ? { increment: 1 }
              : undefined,
        }
      });

      return { success: true };

    });
  }),


//ФИНИШЬ ГРУППОВОГО ЭТАПА
  finishGroupStage: protectedProcedure
    .input(z.object({ idTournir: z.string() }))
    .mutation(async ({ ctx, input }) => {

      const { idTournir } = input;

      return await ctx.db.$transaction(async (tx) => {

        // 1️⃣ Получаем турнир
        const tournament = await tx.turnir.findUnique({
          where: { id: idTournir },
          include: {
            groups: {
              include: {
                matches: {
                  include: { result: true }
                }
              }
            }
          }
        });

        if (!tournament)
          throw new TRPCError({ code: "NOT_FOUND" });

        if (tournament.stage !== TypeStage.GROUP)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Групповой этап уже завершён"
          });

        const allMatches = tournament.groups.flatMap(g => g.matches);

        if (allMatches.length === 0)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Нет матчей"
          });

        // 2️⃣ Проверка что ВСЕ матчи сыграны
        const notFinished = allMatches.some(m => !m.result);
        if (notFinished)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Не все матчи сыграны"
          });

        // 3️⃣ Обнуляем статистику
        await tx.turnirParticipant.updateMany({
          where: { tournamentId: idTournir },
          data: {
            points: 0,
            wins: 0,
            defeat: 0,
            scoreFor: 0,
            scoreAgainst: 0
          }
        });

        // 4️⃣ Пересчитываем статистику по всем матчам
        for (const match of allMatches) {
          const result = match.result!;
          const { scoreA, scoreB, winnerId } = result;

          // Игрок A
          await tx.turnirParticipant.update({
            where: { id: match.playerAId },
            data: {
              scoreFor: { increment: scoreA },
              scoreAgainst: { increment: scoreB },
              ...(winnerId === match.playerAId
                ? { wins: { increment: 1 }, points: { increment: 3 } }
                : { defeat: { increment: 1 } })
            }
          });

          // Игрок B
          await tx.turnirParticipant.update({
            where: { id: match.playerBId },
            data: {
              scoreFor: { increment: scoreB },
              scoreAgainst: { increment: scoreA },
              ...(winnerId === match.playerBId
                ? { wins: { increment: 1 }, points: { increment: 3 } }
                : { defeat: { increment: 1 } })
            }
          });
        }

        // 5️⃣ Обработка только HEAD_TO_HEAD
        let extraMatchesCreated = false;

        if (tournament.tiebreakType === TiebreakType.HEAD_TO_HEAD) {

          for (const group of tournament.groups) {

            const participants = await tx.turnirParticipant.findMany({
              where: { groupId: group.id }
            });

            // группируем по очкам
            const map = new Map<number, typeof participants>();

            for (const p of participants) {
              if (!map.has(p.points)) map.set(p.points, []);
              map.get(p.points)!.push(p);
            }

            for (const samePoints of map.values()) {

              if (samePoints.length <= 1) continue;

              // создаём доп. матчи если их ещё нет
              for (let i = 0; i < samePoints.length - 1; i++) {
                for (let j = i + 1; j < samePoints.length; j++) {

                  const playerA = samePoints[i]!;
                  const playerB = samePoints[j]!;

                  const existing = await tx.groupMatch.findFirst({
                    where: {
                      round: 0,
                      groupId: group.id,
                      OR: [
                        { playerAId: playerA.id, playerBId: playerB.id },
                        { playerAId: playerB.id, playerBId: playerA.id }
                      ]
                    }
                  });

                  if (!existing) {
                    await tx.groupMatch.create({
                      data: {
                        round: 0,
                        groupId: group.id,
                        playerAId: playerA.id,
                        playerBId: playerB.id
                      }
                    });

                    extraMatchesCreated = true;
                  }
                }
              }
            }
          }
        }

        // 6️⃣ Если создали доп. матчи — НЕ переводим в плей-офф
        if (extraMatchesCreated) {
          return {
            success: false,
            message: "Созданы дополнительные матчи для тай-брейка"
          };
        }

        // 7️⃣ Переводим турнир в BRACKET
        await tx.turnir.update({
          where: { id: idTournir },
          data: {
            stage: TypeStage.BRACKET
          }
        });

        return { success: true };
      });
    }),

})
