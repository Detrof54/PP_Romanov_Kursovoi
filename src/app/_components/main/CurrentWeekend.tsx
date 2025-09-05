"use client";

import { Card, CardContent } from "~/app/ui/card";
import { CalendarDays, Clock } from "lucide-react";

type Event = {
  id: string;
  type: "TEST_RACE" | "QUALIFICATION" | "RACE";
  data: string; // ISO дата
};

type WeekendProps = {
  city: string;
  nameTrassa: string;
  seasonYear: number;
  events: Event[];
};

export default function CurrentWeekend({
  city,
  nameTrassa,
  seasonYear,
  events,
}: WeekendProps) {
  // Хелпер для форматирования даты
  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // находим события по типу
  const practice = events.find((e) => e.type === "TEST_RACE");
  const qualification = events.find((e) => e.type === "QUALIFICATION");
  const race = events.find((e) => e.type === "RACE");

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* Заголовок */}
      <h2 className="text-2xl font-bold text-center">
        {city} — {nameTrassa} ({seasonYear})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* Тренировка */}
        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <h3 className="text-lg font-semibold text-green-600">Тренировка</h3>
            {practice ? (
              <>
                <CalendarDays className="w-5 h-5" />
                <p className="text-base">{formatDateTime(practice.data)}</p>
              </>
            ) : (
              <p className="text-gray-500">Не назначено</p>
            )}
          </CardContent>
        </Card>

        {/* Квалификация */}
        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <h3 className="text-lg font-semibold text-yellow-600">
              Квалификация
            </h3>
            {qualification ? (
              <>
                <CalendarDays className="w-5 h-5" />
                <p className="text-base">{formatDateTime(qualification.data)}</p>
              </>
            ) : (
              <p className="text-gray-500">Не назначено</p>
            )}
          </CardContent>
        </Card>

        {/* Гонка */}
        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <h3 className="text-lg font-semibold text-red-600">Гонка</h3>
            {race ? (
              <>
                <CalendarDays className="w-5 h-5" />
                <p className="text-base">{formatDateTime(race.data)}</p>
              </>
            ) : (
              <p className="text-gray-500">Не назначено</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}