"use client";
import { Card, CardContent } from "~/app/ui/card";
import { CalendarDays, Clock } from "lucide-react";
import { api } from "../../../trpc/react";

type Event = {
  id: string;
  type: "TEST_RACE" | "QUALIFICATION" | "RACE";
  data: string; 
};

type WeekendProps = {
  city: string;
  nameTrassa: string;
  seasonYear: number;
  events: Event[];
};

export default function CurrentWeekendDark() {

const { data: weekend, isLoading, isError } = api.mainPageRouter.getCurrentWeekend.useQuery();

const formatDateTime = (date: string | Date) => {
  const d = date instanceof Date ? date : new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString("ru-RU", { month: "long" });
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");

  return `${day} ${month}, ${hours}:${minutes}`;
};

  console.log(weekend)

  if (isLoading) return <p className="text-white text-center">Загрузка...</p>;
  if (isError || !weekend) return <p className="text-white text-center">Не удалось загрузить данные</p>;



  const practice = weekend?.events.find(e => e.type === "TEST_RACE");
  const qualification = weekend?.events.find(e => e.type === "QUALIFICATION");
  const race = weekend?.events.find(e => e.type === "RACE");

  
return (
    <div className="flex flex-col items-center gap-8 p-8 bg-transparent text-white">
      {/* Заголовок */}
      <h2 className="text-3xl font-bold text-center">
        {weekend.city} — {weekend.nameTrassa} ({weekend.season.year})
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