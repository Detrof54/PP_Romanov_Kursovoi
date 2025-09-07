"use client";

import { Card, CardContent } from "~/app/ui/card";
import { CalendarDays } from "lucide-react";

// api для клиента!!!
import { api } from "~/trpc/react";


type Weekend = {
  id: string;
  city: string;
  nameTrassa: string;
  seasonYear: number;
  events: {
    type: "TEST_RACE" | "QUALIFICATION" | "RACE";
    data: string;
  }[];
};

type WeekendOverviewProps = {
  weekendPCN: {
    previous?: Weekend;
    current?: Weekend;
    next?: Weekend;
  };
};

export default function WeekendOverview({ weekendPCN }: WeekendOverviewProps) {
  const { previous, current, next } = weekendPCN;

  if(!weekendPCN){return <p className="text-white text-center">Не удалось загрузить данные</p>}

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "long" });
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  };

  function typeEventText(typeEvent: Weekend["events"][number]["type"]){
    if(typeEvent === "TEST_RACE")
      return "Тестовые заезды"
    if(typeEvent === "QUALIFICATION")
      return "Квалификация"
    if(typeEvent === "RACE")
      return "Гонка"
  }

  const renderWeekendCard = (weekend?: Weekend, label?: string) => (
    <Card className="!bg-gray-800 border border-gray-700 hover:scale-105 transition-transform duration-300">
      <CardContent className="flex flex-col items-center text-center gap-3">
        <h3 className="text-lg font-semibold text-white">{label}</h3>
        {weekend ? (
          <>
            <p className="text-base font-medium text-gray-300">
              {weekend.city} — {weekend.nameTrassa} ({weekend.seasonYear})
            </p>
            <div className="flex flex-col gap-1 mt-2 items-start text-left">
              {weekend.events.map((e) => (
                <div key={`${e.type}-${e.data}`} className="flex items-center gap-2 text-gray-400">
                  <CalendarDays className="w-4 h-4 text-gray-400" />
                  <span>{`${typeEventText(e.type)}: ${formatDate(e.data)} ${formatTime(e.data)}`}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500">Нет данных</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-4 text-center">Ближайшие гоночные недели</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {renderWeekendCard(previous, "Предыдущий")}
        {renderWeekendCard(current, "Текущий")}
        {renderWeekendCard(next, "Следующий")}
      </div>
    </div>
  );
}