"use client";

import { MatchStatus } from "@prisma/client";
import type { Group } from "./Group";


function participantPoints(participantId: string, group: Group){
  let points = 0;
  for (const match of group.matches) {
    if(match.status === MatchStatus.FINISHED && !match.result)
      Error("Матч завершен, но результатов нет")
    if (match.result) {
      if (match.playerAId === participantId) {
        points+=match.result.scoreA
      }
      else if (match.playerBId === participantId) {
        points+=match.result.scoreB
      }
    }
  }
  return points;
}

export default function GroupTables({ groups }: { groups: Group[] }) {
  return (
    <div className="flex flex-col gap-12">
      {groups.map((group) => {
        const sortedParticipants = [...group.participants]
          .map((tp) => ({
            ...tp,
            calculatedPoints: participantPoints(tp.id, group),
          }))
          .sort((a, b) => b.calculatedPoints - a.calculatedPoints);

        return (
          <div
            key={group.id}
            className="rounded-xl border border-gray-700 bg-gray-800 p-6"
          >
            <div className="overflow-hidden rounded-lg border border-gray-700">
              <table className="w-full border-collapse text-sm text-white">
                <caption className="mb-2 text-left text-base font-semibold">
                  Группа {group.name}
                </caption>

                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-center">П</th>
                    <th className="px-4 py-2 text-left">Участник</th>
                    <th className="px-4 py-2 text-center">Очки</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedParticipants.map((tp, index) => (
                    <tr
                      key={tp.id}
                      className={`border-t border-gray-700 ${
                        index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"
                      }`}
                    >
                      <td className="px-4 py-2 text-center font-semibold">
                        {index + 1}
                      </td>

                      <td className="px-4 py-2">
                        {tp.participant ? `${tp.participant.surname}  ${tp.participant.firstname}` : "Без имени"}
                      </td>

                      <td className="px-4 py-2 text-center">
                        {tp.calculatedPoints}
                      </td>
                    </tr>
                  ))}

                  {sortedParticipants.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-4 text-center text-gray-400"
                      >
                        В группе нет участников
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
