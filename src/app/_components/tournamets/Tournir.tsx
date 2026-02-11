"use client";

import { Card, CardContent } from "~/app/ui/card";
import { CalendarDays } from "lucide-react";
import { api } from "~/trpc/react";
import { TiebreakType, TypeStage, type Role } from "@prisma/client";
import Group from "./Group";
import Bracket from "./Bracket";
import TableRezultTournir from "./TableRezultTournir";

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

  const groups = tournir?.groups ?? [];
  const brackets = tournir?.brackets ?? [];
  
  return (
    <div className="flex flex-col gap-8 p-8 bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-4 text-center">{tournir.nameTurnir || "Турнир"}</h2>
      <div className="flex flex-col gap-2 mb-2">
        <h4 className="text-2xl text-gray-300"> Описание:  {tournir.description || "Без описания"}</h4>
      </div>
      <div className="flex flex-col gap-2 mb-2">
            <ul className="text-lg text-gray-400 space-y-1 mb-3">
              <li><b className="text-gray-300">Организатор:</b> {`${tournir.createdBy.surname} ${tournir.createdBy.firstname}`}</li>
              <li><b className="text-gray-300">Текущий этап турнира:</b> {Perevod(tournir.stage)}</li>
              <li><b className="text-gray-300">Всего участников:</b> {tournir.participantsCount}</li>
              <li><b className="text-gray-300">Количество групп:</b> {tournir.groupsCount}</li>
              <li><b className="text-gray-300">Тай-брейк:</b> {PerevodTiebreakType(tournir.tiebreakType)}</li>
              <li><b className="text-gray-300">Дата создания:</b> {new Date(tournir.createdAt).toLocaleDateString("ru-RU")}</li>
              <li><b className="text-gray-300">Дата обновления:</b> {new Date(tournir.updatedAt).toLocaleDateString("ru-RU")}</li>
            </ul>
      </div>
      <h2 className="text-2xl font-bold mb-2 text-center">Групповой этап</h2>
      <Group groups={groups} />
      <h2 className="text-2xl font-bold mb-2 mt-4 text-center">Этап на выбывание</h2>
      <Bracket brackets={brackets} />
      <h2 className="text-2xl font-bold mt-6 text-center">Общие результаты турнира</h2>
      <TableRezultTournir tournir={tournir} />
    </div>
  );
}