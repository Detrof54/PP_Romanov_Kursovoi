"use client"

import { MatchStatus, Role, TiebreakType, TypeStage } from "@prisma/client";
import type { Group, TurnirParticipant } from "./Group";
import type { Bracket, BracketMatch } from "./Bracket";

export interface User{
  id: string
  firstname: string | null
  surname: string | null
  email: string | null
  role: Role
}

export interface Tournir {
  id: string;
  nameTurnir: string;
  description: string | null;
  stage: TypeStage
  participantsCount: number
  groupsCount: number
  tiebreakType: TiebreakType
  createdAt: Date
  updatedAt: Date
  createdById: string
  createdBy: User
  participants: TurnirParticipant[]
  groups: Group[]
  brackets: Bracket[]
}

type ResultRow = {
  place: number;
  participant: TurnirParticipant;
};

export default function TableRezultTournir({ tournir }: { tournir: Tournir }) {
  if (tournir.stage !== TypeStage.FINISHED) {
    return <h3 className="text-gray-400">Турнир ещё не завершён</h3>;
  }

  const places = new Map<string, number>();

  /* ---------------- 1. Верхняя сетка: 1 и 2 место ---------------- */
  const upperBracket = tournir.brackets.find(b => b.type === "UPPER");

  if (upperBracket) {
    const finished = upperBracket.matches.filter(
      m => m.status === MatchStatus.FINISHED
    );

    const finalRound = Math.max(...finished.map(m => m.round));
    const finalMatch = finished.find(m => m.round === finalRound);

    if (finalMatch && finalMatch.result.length > 0) {
      const lastResult = finalMatch.result.at(-1)!;

      places.set(lastResult.winnerId, 1);

      const loserId =
        finalMatch.playerAId === lastResult.winnerId
          ? finalMatch.playerBId
          : finalMatch.playerAId;

      places.set(loserId, 2);
    }
  }

  /* ---------------- 2. Доп-матчи (round = 0) ---------------- */
  const extraMatches: BracketMatch[] = tournir.brackets.flatMap(b =>
    b.matches.filter(
      m => m.round === 0 && m.status === MatchStatus.FINISHED
    )
  );

  let currentPlace = 3;

  for (const match of extraMatches) {
    if (match.result.length === 0) continue;

    const r = match.result.at(-1)!;

    if (!places.has(r.winnerId)) {
      places.set(r.winnerId, currentPlace++);
    }

    const loserId =
      match.playerAId === r.winnerId
        ? match.playerBId
        : match.playerAId;

    if (!places.has(loserId)) {
      places.set(loserId, currentPlace++);
    }
  }

  /* ---------------- 3. Остальные — тайбрек ---------------- */
  const unresolved = tournir.participants.filter(
    p => !places.has(p.id)
  );

  unresolved.sort((a, b) => {
    switch (tournir.tiebreakType) {
      case TiebreakType.POINTS:
        return b.points - a.points;

      case TiebreakType.SCORE_DIFF:
        return (
          (b.scoreFor - b.scoreAgainst) -
          (a.scoreFor - a.scoreAgainst)
        );

      case TiebreakType.HEAD_TO_HEAD:
        return (
          b.points - a.points ||
          (b.scoreFor - b.scoreAgainst) -
            (a.scoreFor - a.scoreAgainst)
        );

      default:
        return 0;
    }
  });

  for (const p of unresolved) {
    places.set(p.id, currentPlace++);
  }

  /* ---------------- 4. Финальный список ---------------- */
  const result: ResultRow[] = Array.from(places.entries())
    .map(([id, place]) => ({
      place,
      participant: tournir.participants.find(p => p.id === id)!,
    }))
    .sort((a, b) => a.place - b.place);

  /* ---------------- UI ---------------- */
  return (
    <div className="mt-8">
      <h2 className="mb-4 text-2xl font-bold text-white">
        Итоговая таблица результатов
      </h2>

      <div className="overflow-hidden rounded-lg border border-gray-700">
        <table className="w-full text-sm text-white">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">Место</th>
              <th className="px-4 py-2 text-left">Участник</th>
              <th className="px-4 py-2 text-right">Очки</th>
              <th className="px-4 py-2 text-right">Победы</th>
              <th className="px-4 py-2 text-right">Разница</th>
            </tr>
          </thead>
          <tbody>
            {result.map(r => (
              <tr
                key={r.participant.id}
                className="border-t border-gray-700 hover:bg-gray-800"
              >
                <td className="px-4 py-2 font-semibold">
                  {r.place}
                </td>
                <td className="px-4 py-2">
                  {r.participant.participant?.surname}{" "}
                  {r.participant.participant?.firstname}
                </td>
                <td className="px-4 py-2 text-right">
                  {r.participant.points}
                </td>
                <td className="px-4 py-2 text-right">
                  {r.participant.wins}
                </td>
                <td className="px-4 py-2 text-right">
                  {r.participant.scoreFor -
                    r.participant.scoreAgainst}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}