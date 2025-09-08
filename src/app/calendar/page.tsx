"use server";

import { api } from "~/trpc/server";
import CalendarSeason from "../_components/calendar/calendarSeason";


export default async function Page() {
  const years: number[] = await api.calendarRouter.getListYear();

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white">
      <CalendarSeason years={years} />
    </div>
  );
}