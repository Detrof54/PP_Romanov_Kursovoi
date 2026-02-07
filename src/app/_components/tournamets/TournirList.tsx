"use client";

import { Card, CardContent } from "~/app/ui/card";
import { CalendarDays } from "lucide-react";
import { api } from "~/trpc/react";
import { TypeStage, type Role } from "@prisma/client";
import Link from "next/link";


export function Perevod(type: TypeStage){
  if(type === TypeStage.GROUP)
    return "Групповой"
  else if(type === TypeStage.BRACKET)
    return "Плей-офф"
  else if(type === TypeStage.FINISHED)
    return "Завершенный"
  else 
    return "-"
}

export default function TournirList({role}: {role: Role | undefined}){
  const { data: tournirs, isLoading, error, refetch } = api.tournametsRouter.getTurnirs.useQuery();
  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Error: {(error as any)?.message || "Ошибка"}</div>;
  if (!tournirs) return <div>Нет турниров</div>;


  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-4 text-center">Список турниров</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tournirs.map((tournir) => (
          <Link key={tournir.id} href={`/tournaments/${tournir.id}`} className="block">
            <div className="border border-gray-700 rounded-xl p-5 bg-gray-800 hover:bg-gray-700 transition cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold"> {tournir.nameTurnir || "Без названия"}</h3>
                {(role === "ADMIN" || role) && (
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="text-blue-400 hover:text-blue-300"
                      title="Редактировать"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="text-red-500 hover:text-red-400"
                      title="Удалить"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>

              <p className="text-gray-400 text-sm space-y-1">
                <div>
                  <span className="font-medium text-gray-300">
                    Текущий этап:</span>{" "}{Perevod(tournir.stage)}
                </div>

                <div>
                  <span className="font-medium text-gray-300">
                    Участников:</span>{" "}{tournir.participantsCount}
                </div>

                <div>
                  <span className="font-medium text-gray-300">
                    Дата создания: </span>{" "} {new Date(tournir.createdAt).toLocaleDateString("ru-RU")}
                </div>

                <div>
                  <span className="font-medium text-gray-300">
                    Организатор:</span>{" "}{`${tournir.createdBy.surname} ${tournir.createdBy.firstname}`}
                </div>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}