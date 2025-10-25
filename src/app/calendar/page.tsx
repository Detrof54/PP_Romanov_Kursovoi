"use server";

import { api } from "~/trpc/server";
import CalendarSeason from "../_components/calendar/calendarSeason";
import { auth } from "~/server/auth";
import SeasonManager from "../_components/calendar/sesonCRUD";

//Страница "Календарь"
export default async function Page() {
  const years: number[] = await api.calendarRouter.getListYear();

  // Определяем роль пользователя из
  const session = await auth();
  const role = session?.user?.role ?? "USER";

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white">
      {/* Компонент для вывода календаря сезона. (добавления этапов) */}
      <CalendarSeason years={years} role = {role}/>
      {session?.user.role === "ADMIN" && <SeasonManager />}
    </div>
  );
}