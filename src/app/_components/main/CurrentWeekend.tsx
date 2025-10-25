"use client";
import { Card, CardContent } from "~/app/ui/card";
import { CalendarDays, Clock } from "lucide-react";
import { api } from "../../../trpc/react";

// type Event = {
//   id: string;
//   type: "TEST_RACE" | "QUALIFICATION" | "RACE";
//   data: string; 
// };

// type WeekendProps = {
//   city: string;
//   nameTrassa: string;
//   seasonYear: number;
//   events: Event[];
// };

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

export default function CurrentWeekendDark({ weekendPCN }: WeekendOverviewProps) {

  const {current} = weekendPCN

//tRPC запрос
// const { data: weekend, isLoading, isError } = api.mainPageRouter.getCurrentWeekend.useQuery();

const formatDateTime = (date: string | Date) => {
  const d = date instanceof Date ? date : new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString("ru-RU", { month: "long" });
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");

  return `${day} ${month}, ${hours}:${minutes}`;
};


  // if (isLoading) return <p className="text-white text-center">Загрузка...</p>;
  if (!current) return (
    <div>
      <h2 className="text-3xl font-bold text-center">
        Не гоночная неделя
      </h2>
      <p className="text-white text-center">На этой неделе гонки не запланированы</p>
    </div>
    
  );



  const practice = current?.events.find(e => e.type === "TEST_RACE");
  const qualification = current?.events.find(e => e.type === "QUALIFICATION");
  const race = current?.events.find(e => e.type === "RACE");

  
return (
    <div className="flex flex-col items-center gap-8 p-8 bg-transparent text-white">
      {/* Заголовок */}
      <h2 className="text-3xl font-bold text-center">
        {current.city} — {current.nameTrassa} ({current.seasonYear})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Тренировка */}
        <Card className="!bg-gray-800 border border-gray-700 hover:scale-105 transition-transform duration-300">
          <CardContent className="flex flex-col items-center text-center gap-3">
            <h3 className="text-lg font-semibold">Тренировка</h3>
            {practice ? (
              <>
                <CalendarDays className="w-6 h-6" />
                <p className="text-base">{formatDateTime(practice.data)}</p>
              </>
            ) : (
              <p className="text-gray-400">Не назначено</p>
            )}
          </CardContent>
        </Card>

        {/* Квалификация */}
        <Card className="!bg-gray-800 border border-gray-700 hover:scale-105 transition-transform duration-300">
          <CardContent className="flex flex-col items-center text-center gap-3">
            <h3 className="text-lg font-semibold">Квалификация</h3>
            {qualification ? (
              <>
                <CalendarDays className="w-6 h-6" />
                <p className="text-base">{formatDateTime(qualification.data)}</p>
              </>
            ) : (
              <p className="text-gray-400">Не назначено</p>
            )}
          </CardContent>
        </Card>

        {/* Гонка */}
        <Card className="!bg-gray-800 border border-gray-700 hover:scale-105 transition-transform duration-300">
          <CardContent className="flex flex-col items-center text-center gap-3">
            <h3 className="text-lg font-semibold">Гонка</h3>
            {race ? (
              <>
                <CalendarDays className="w-6 h-6" />
                <p className="text-base">{formatDateTime(race.data)}</p>
              </>
            ) : (
              <p className="text-gray-400">Не назначено</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}