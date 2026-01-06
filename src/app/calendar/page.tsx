"use server";

import { api } from "~/trpc/server";
import CalendarSeason from "../_components/calendar/calendarSeason";
import { auth } from "~/server/auth";
import SeasonManager from "../_components/calendar/sesonCRUD";

export default async function Page() {
  const years: number[] = await api.calendarRouter.getListYear();

  const session = await auth();
  const role = session?.user?.role ?? "USER";

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white">
      <CalendarSeason years={years} role = {role}/>
      {session?.user.role === "ADMIN" && <SeasonManager />}
    </div>
  );
}