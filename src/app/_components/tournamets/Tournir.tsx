"use client";

import { Card, CardContent } from "~/app/ui/card";
import { CalendarDays } from "lucide-react";
import { api } from "~/trpc/react";
import { TiebreakType, TypeStage, type Role } from "@prisma/client";

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

export function PerevodTiebreakType(type: TiebreakType){
  if(type === TiebreakType.HEAD_TO_HEAD)
    return "результаты личных встреч"
  else if(type === TiebreakType.POINTS)
    return "дополнительные показатели по набранным очкам"
  else if(type === TiebreakType.SCORE_DIFF)
    return "разницы набранных и пропущенных очков"
  else 
    return "-"
}


export default function Tournir({role, idTournir}: {role: Role | undefined, idTournir: string}){

  const { data: tournir, isLoading, error, refetch } = api.tournametsRouter.getTurnir.useQuery({idTournir});
  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Error: {(error as any)?.message || "Ошибка"}</div>;
  if (!tournir) return <div>Нет информации о турнире</div>;

  const groups = tournir?.groups.map ?? [];
  
  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-4 text-center">Турнир</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold"> Название турнира:  {tournir.nameTurnir || "Без названия"} </h3>
              <h4 className="text-xl font-semibold"> Описание:  {tournir.description || "Без описания"}</h4>
            </div>
            <p className="text-gray-400 text-sm mb-3">
              <span className="font-medium text-gray-300">Текущий этап турнира:</span>{" "}{Perevod(tournir.stage)}
              <span className="font-medium text-gray-300">Всего участников турнира:</span>{" "}{tournir.participantsCount}
              <span className="font-medium text-gray-300">Дата создания:</span>{" "}{new Date(tournir.createdAt).toLocaleDateString("ru-RU")}
              <span className="font-medium text-gray-300">Дата обновления:</span>{" "}{new Date(tournir.updatedAt).toLocaleDateString("ru-RU")}
              <span className="font-medium text-gray-300">Организатор:</span>{" "}{`${tournir.createdBy.surname} ${tournir.createdBy.firstname}`}
              <span className="font-medium text-gray-300">Количество групп:</span>{" "}{tournir.groupsCount}
              <span className="font-medium text-gray-300">Тай-брейк:</span>{" "}{PerevodTiebreakType(tournir.tiebreakType)}
            </p>
      </div>

    </div>
  );
}