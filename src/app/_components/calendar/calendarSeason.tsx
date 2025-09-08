"use client";

import { api } from "~/trpc/react";
import { useSearchParams } from "next/navigation";

interface CalendarSeasonProps {
  years: number[];
}
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

  function typeEventText(typeEvent: Weekend["events"][number]["type"]){
    if(typeEvent === "TEST_RACE")
      return "Тестовые заезды"
    if(typeEvent === "QUALIFICATION")
      return "Квалификация"
    if(typeEvent === "RACE")
      return "Гонка"
  }

const formatRange = (weekend: { dateStart: Date; dateEnd: Date }) => {
  const start = new Date(weekend.dateStart).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
  });

  const end = new Date(weekend.dateEnd).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
  });

  return `${start} - ${end}`;
};

export default function CalendarSeason({ years }: CalendarSeasonProps) {
  const searchParams = useSearchParams();
  const selectedYear = searchParams.get("year")
    ? Number(searchParams.get("year"))
    : undefined;

  const { data: season, isLoading, error } = api.calendarRouter.getListWeekends.useQuery({ year: selectedYear });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!season) return <div>No data</div>;

  return (
    <div className="bg-gray-900 p-4 text-white">
      <form method="get">
        <label htmlFor="yearSelect" className="mr-2">
          Выберите год:
        </label>
        <select
          id="yearSelect"
          name="year"
          defaultValue={selectedYear ?? ""}
          className="bg-gray-800 text-white p-1 rounded"
          onChange={(e) => e.currentTarget.form?.submit()}
        >
          <option value="">-- Выберите год --</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </form>

      <h2 className="text-2xl font-bold mb-4">Сезон {season.year}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {season.weekend.map((weekend) => (
          <div
            key={weekend.id}
            className="border rounded-lg p-4 shadow-md bg-gray-800 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2">
              {weekend.nameTrassa || "Weekend"}
            </h3>

            <p className="text-sm text-gray-500 mb-2">
              {formatRange(weekend)}
            </p>

            <ul className="space-y-1">
              {weekend.events.map((event) => (
                <li key={event.id} className="text-sm">
                  <span className="font-medium">{typeEventText(event.type)}</span> -{" "}
                  {new Date(event.data).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}