import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { number, z } from "zod";
import { isAdmin, isOrganizer, isOrganizerOwner } from "~/app/api/auth/check";
import { BracketType, TiebreakType, TypeStage } from "@prisma/client";


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

})