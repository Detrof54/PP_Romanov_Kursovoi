import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { number, z } from "zod";
import { isAdmin, isOrganizer, isOrganizerOwner } from "~/app/api/auth/check";
import { BracketType, MatchStatus, Prisma, TiebreakType, TypeStage } from "@prisma/client";


export const tournametsBracketRouter = createTRPCRouter({

  formationBracket: protectedProcedure
      .input(
        z.object({
          idTournir: z.string(),
          upper: z.object({
            create: z.boolean(),
            size: z.number(),
            doubleElim: z.boolean(),
          }),
          lower: z.object({
            create: z.boolean(),
            size: z.number(),
            doubleElim: z.boolean(),
          }),
          consolation: z.object({
            create: z.boolean(),
            size: z.number(),
            doubleElim: z.boolean(),
          }),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { idTournir, upper, lower, consolation } = input;

        return ctx.db.$transaction(async (tx) => {
          const tournament = await tx.turnir.findUnique({
            where: { id: idTournir },
            include: { participants: true },
          });

          if (!tournament)
            throw new TRPCError({ code: "NOT_FOUND", message: "Турнир не найден" });

          if (tournament.stage !== TypeStage.BRACKET)
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Сначала завершите групповой этап",
            });

          const totalParticipants = tournament.participants.length;

          const checkEven = (n: number) => n % 2 === 0 && n >= 2;

          if (upper.create && !checkEven(upper.size))
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Верхняя сетка должна быть чётной и >= 2",
            });

          if (lower.create && !checkEven(lower.size))
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Нижняя сетка должна быть чётной и >= 2",
            });

          if (consolation.create && !checkEven(consolation.size))
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Утешительная сетка должна быть чётной и >= 2",
            });

          if (upper.size > Math.floor(totalParticipants * 0.8))
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Верхняя сетка превышает 80% участников",
            });

          // Получаем и сортируем участников
          const participants = await tx.turnirParticipant.findMany({
            where: { tournamentId: idTournir },
          });

          participants.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            return b.scoreFor - b.scoreAgainst - (a.scoreFor - a.scoreAgainst);
          });

          // Разделяем участников
          const upperPlayers = upper.create
            ? participants.slice(0, upper.size)
            : [];
          const remainingAfterUpper = participants.slice(upper.size);

          const lowerPlayers =
            lower.create && remainingAfterUpper.length >= 2
              ? remainingAfterUpper.slice(0, lower.size)
              : [];
          const remainingAfterLower = remainingAfterUpper.slice(lowerPlayers.length);

          const consolationPlayers =
            consolation.create && lower.create && remainingAfterLower.length >= 2
              ? remainingAfterLower.slice(0, consolation.size)
              : [];

          const createdBrackets: { id: string; players: typeof participants }[] = [];

          const createBracket = async (
            type: BracketType,
            doubleElim: boolean,
            players: typeof participants
          ) => {
            if (players.length < 2) return;

            const bracket = await tx.bracket.create({
              data: { type, doubleElim, tournamentId: idTournir },
            });

            createdBrackets.push({ id: bracket.id, players });
          };

          // Создаём сетки только если участников достаточно
          if (upperPlayers.length >= 2)
            await createBracket(BracketType.UPPER, upper.doubleElim, upperPlayers);

          if (lowerPlayers.length >= 2)
            await createBracket(BracketType.LOWER, lower.doubleElim, lowerPlayers);

          if (lowerPlayers.length >= 2 && consolationPlayers.length >= 2)
            await createBracket(
              BracketType.CONSOLATION,
              consolation.doubleElim,
              consolationPlayers
            );

          // Создаём матчи первого раунда
          for (const bracket of createdBrackets) {
            const matches = [];
            for (let i = 0; i < bracket.players.length; i += 2) {
              const playerA = bracket.players[i];
              const playerB = bracket.players[i + 1];
              if (!playerA || !playerB) continue;

              matches.push({
                round: 1,
                bracketId: bracket.id,
                playerAId: playerA.id,
                playerBId: playerB.id,
              });
            }
            if (matches.length > 0)
              await tx.bracketMatch.createMany({ data: matches });
          }

          return { success: true };
        });
      }),

  setMatchResult: protectedProcedure
  .input(
    z.object({
      matchId: z.string(),
      scoreA: z.number(),
      scoreB: z.number(),
    })
  )
  .mutation(async ({ ctx, input }) => {

    return await ctx.db.$transaction(async (tx) => {

      const match = await tx.bracketMatch.findUnique({
        where: { id: input.matchId },
        include: {
          bracket: true,
          result: true,
        }
      });

      if (!match)
        throw new Error("Матч не найден");

      if (match.status === MatchStatus.FINISHED)
        throw new Error("Матч уже завершён");

      // --- определяем победителя ---
      let winnerId: string | null = null;

      if (input.scoreA > input.scoreB)
        winnerId = match.playerAId;
      else if (input.scoreB > input.scoreA)
        winnerId = match.playerBId;

      // --- сохраняем игру ---
      await tx.bracketMatchResult.create({
        data: {
          scoreA: input.scoreA,
          scoreB: input.scoreB,
          winnerId,
          bracketMatchId: match.id,
        },
      });

      // если ничья — просто сохраняем
      if (!winnerId)
        return { success: true };

      // --- считаем победы ---
      const allResults = await tx.bracketMatchResult.findMany({
        where: {
          bracketMatchId: match.id,
          winnerId: { not: null }
        }
      });

      let winsA = 0;
      let winsB = 0;

      for (const r of allResults) {
        if (r.winnerId === match.playerAId) winsA++;
        if (r.winnerId === match.playerBId) winsB++;
      }

      const winsRequired = match.bracket.doubleElim ? 2 : 1;

      // --- если серия завершена ---
      if (winsA >= winsRequired || winsB >= winsRequired) {

        await tx.bracketMatch.update({
          where: { id: match.id },
          data: { status: MatchStatus.FINISHED },
        });

        // 🔥 ПРОВЕРЯЕМ ЗАВЕРШЁН ЛИ РАУНД

        const roundMatches = await tx.bracketMatch.findMany({
          where: {
            bracketId: match.bracketId,
            round: match.round,
          },
          include: { result: true }
        });

        const roundFinished =
          roundMatches.every(m => m.status === MatchStatus.FINISHED);

        if (!roundFinished)
          return { success: true };

        // === ФИНАЛ ===
        if (roundMatches.length === 1) {

          const thirdExists = await tx.bracketMatch.findFirst({
            where: {
              bracketId: match.bracketId,
              round: 0,
            }
          });

          if (!thirdExists) {

            const semifinalMatches = await tx.bracketMatch.findMany({
              where: {
                bracketId: match.bracketId,
                round: match.round - 1,
              },
              include: { result: true }
            });

            if (semifinalMatches.length === 2) {

              const losers: string[] = [];

              for (const sm of semifinalMatches) {

                const winsA = sm.result.filter(r => r.winnerId === sm.playerAId).length;
                const winsB = sm.result.filter(r => r.winnerId === sm.playerBId).length;

                if (winsA > winsB && sm.playerBId)
                  losers.push(sm.playerBId);

                if (winsB > winsA && sm.playerAId)
                  losers.push(sm.playerAId);
              }

              if (losers.length === 2 && losers[0] && losers[1]) {
                await tx.bracketMatch.create({
                  data: {
                    bracketId: match.bracketId,
                    round: 0,
                    playerAId: losers[0],
                    playerBId: losers[1],
                    status: MatchStatus.SCHEDULED,
                  }
                });
              }
            }
          }

          return { success: true };
        }

        // === СОЗДАНИЕ СЛЕДУЮЩЕГО РАУНДА ===

        const winners: string[] = [];

        for (const m of roundMatches) {

          const winsA = m.result.filter(r => r.winnerId === m.playerAId).length;
          const winsB = m.result.filter(r => r.winnerId === m.playerBId).length;

          if (winsA > winsB && m.playerAId)
            winners.push(m.playerAId);

          if (winsB > winsA && m.playerBId)
            winners.push(m.playerBId);
        }

        for (let i = 0; i < winners.length; i += 2) {

          const playerA = winners[i];
          const playerB = winners[i + 1];

          if (!playerA || !playerB) continue;

          await tx.bracketMatch.create({
            data: {
              bracketId: match.bracketId,
              round: match.round + 1,
              playerAId: playerA,
              playerBId: playerB,
              status: MatchStatus.SCHEDULED,
            }
          });
        }
      }

      return { success: true };

    });
  }),

  // ===============================
  // 2️⃣ Генерация следующего раунда
  // ===============================
  generateNextRound: protectedProcedure
    .input(z.object({ bracketId: z.string() }))
    .mutation(async ({ ctx, input }) => {

      return await ctx.db.$transaction(async (tx) => {

        const bracket = await tx.bracket.findUnique({
          where: { id: input.bracketId },
          include: {
            matches: {
              include: {
                result: {
                  orderBy: { createdAt: "desc" },
                  take: 1
                }
              }
            }
          }
        });

        if (!bracket)
          throw new Error("Сетка не найдена");

        if (!bracket.matches.length)
          throw new Error("В сетке нет матчей");

        // Определяем текущий максимальный раунд
        const maxRound = Math.max(...bracket.matches.map(m => m.round));

        const currentMatches = bracket.matches.filter(
          m => m.round === maxRound
        );

        // Проверка: не финал ли это
        if (currentMatches.length === 1)
          throw new Error("Финальный раунд — следующий создавать нельзя");

        // Проверка: все матчи завершены
        if (currentMatches.some(m => m.status !== MatchStatus.FINISHED))
          throw new Error("Не все матчи текущего раунда завершены");

        // Проверка: не создан ли уже следующий раунд
        const nextRoundExists = bracket.matches.some(
          m => m.round === maxRound + 1
        );

        if (nextRoundExists)
          throw new Error("Следующий раунд уже создан");

        // Определяем победителей
        const winners: string[] = [];

        for (const match of currentMatches) {

          const lastResult = match.result[0];

          if (!lastResult || !lastResult.winnerId)
            throw new Error("У завершённого матча отсутствует результат");

          winners.push(lastResult.winnerId);
        }

        // Победителей должно быть чётное количество
        if (winners.length % 2 !== 0)
          throw new Error("Нечётное количество победителей");

        const newRound = maxRound + 1;

        const matchesToCreate: Prisma.BracketMatchCreateManyInput[] = [];

        for (let i = 0; i < winners.length; i += 2) {

          const playerAId = winners[i];
          const playerBId = winners[i + 1];

          if (!playerAId || !playerBId)
            throw new Error("Ошибка формирования пар");

          matchesToCreate.push({
            round: newRound,
            playerAId,
            playerBId,
            bracketId: bracket.id,
          });
        }

        await tx.bracketMatch.createMany({
          data: matchesToCreate,
        });

        return { success: true };
      });

    }),
  // ===============================
  // 3️⃣ Матч за 3 место (round = 0)
  // ===============================
generateThirdPlaceMatch: protectedProcedure
  .input(z.object({ bracketId: z.string() }))
  .mutation(async ({ ctx, input }) => {

    return await ctx.db.$transaction(async (tx) => {

      const bracket = await tx.bracket.findUnique({
        where: { id: input.bracketId },
        include: {
          matches: {
            include: {
              result: {
                orderBy: { createdAt: "desc" },
                take: 1
              }
            }
          }
        }
      });

      if (!bracket)
        throw new Error("Сетка не найдена");

      if (!bracket.matches.length)
        throw new Error("В сетке нет матчей");

      const maxRound = Math.max(...bracket.matches.map(m => m.round));

      const finalMatch = bracket.matches.find(m => m.round === maxRound);

      if (!finalMatch)
        throw new Error("Финал не найден");

      if (finalMatch.status !== MatchStatus.FINISHED)
        throw new Error("Финал ещё не завершён");

      const existingThirdPlace = bracket.matches.find(m => m.round === 0);
      if (existingThirdPlace)
        throw new Error("Матч за 3 место уже создан");

      const semifinalRound = maxRound - 1;

      const semifinals = bracket.matches.filter(
        m => m.round === semifinalRound
      );

      if (semifinals.length !== 2)
        throw new Error("Полуфиналы не найдены");

      const [semi1, semi2] = semifinals;

      if (!semi1 || !semi2)
        throw new Error("Ошибка полуфиналов");

      const getLoser = (match: typeof semi1): string => {

        if (match.status !== MatchStatus.FINISHED)
          throw new Error("Полуфинал ещё не завершён");

        const lastResult = match.result[0];

        if (!lastResult?.winnerId)
          throw new Error("Нет результата полуфинала");

        return lastResult.winnerId === match.playerAId
          ? match.playerBId
          : match.playerAId;
      };

      const playerAId = getLoser(semi1);
      const playerBId = getLoser(semi2);

      // 🔥 ВАЖНО: явное указание типа Prisma
      const data: Prisma.BracketMatchUncheckedCreateInput = {
        round: 0,
        playerAId: playerAId,
        playerBId: playerBId,
        bracketId: bracket.id,
      };

      await tx.bracketMatch.create({ data });

      return { success: true };
    })
  }),

  finishTournament: protectedProcedure
  .input(z.object({ tournamentId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    return await ctx.db.$transaction(async (tx) => {

      const tournament = await tx.turnir.findUnique({
        where: { id: input.tournamentId },
        include: {
          participants: true,
          brackets: {
            include: {
              matches: {
                include: {
                  result: true,
                },
              },
            },
          },
        },
      });

      if (!tournament)
        throw new TRPCError({ code: "NOT_FOUND" });

      if (tournament.stage !== TypeStage.BRACKET)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Турнир не в стадии плей-офф",
        });

      const allMatches = tournament.brackets.flatMap(b => b.matches);

      if (allMatches.some(m => m.status !== MatchStatus.FINISHED))
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Не все матчи завершены",
        });

      // 🔁 Сброс статистики
      for (const p of tournament.participants) {
        await tx.turnirParticipant.update({
          where: { id: p.id },
          data: {
            points: 0,
            wins: 0,
            defeat: 0,
            scoreFor: 0,
            scoreAgainst: 0,
          },
        });
      }

      // 📊 Пересчет
      for (const match of allMatches) {
        const result = match.result[0];
        if (!result) continue;

        const { scoreA, scoreB, winnerId } = result;

        // Игрок A
        await tx.turnirParticipant.update({
          where: { id: match.playerAId },
          data: {
            scoreFor: { increment: scoreA },
            scoreAgainst: { increment: scoreB },
            wins: winnerId === match.playerAId ? { increment: 1 } : undefined,
            defeat: winnerId !== match.playerAId ? { increment: 1 } : undefined,
            points: winnerId === match.playerAId ? { increment: 3 } : undefined,
          },
        });

        // Игрок B
        await tx.turnirParticipant.update({
          where: { id: match.playerBId },
          data: {
            scoreFor: { increment: scoreB },
            scoreAgainst: { increment: scoreA },
            wins: winnerId === match.playerBId ? { increment: 1 } : undefined,
            defeat: winnerId !== match.playerBId ? { increment: 1 } : undefined,
            points: winnerId === match.playerBId ? { increment: 3 } : undefined,
          },
        });
      }

      await tx.turnir.update({
        where: { id: input.tournamentId },
        data: { stage: TypeStage.FINISHED },
      });

      return { success: true };
    });
  }),

})