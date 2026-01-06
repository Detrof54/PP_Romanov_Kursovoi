"use client";

import { useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";

interface CalendarSeasonProps {
  years: number[];
}

export function PersonalСreditTable({ years }: CalendarSeasonProps){
    const searchParams = useSearchParams();
    const selectedYear = searchParams.get("year") ? Number(searchParams.get("year")) : undefined;
    const { data: season, isLoading, error } = api.championshipRouter.getTablePersonalCreditChempionship.useQuery({ year: selectedYear });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!season) return <div>No data</div>;

    const pilotsWithPoints = season.pilots.map((pilot) => {
        const totalResultsPoints = pilot.results.reduce(
        (sum, r) => sum + (r.points ?? 0),0);

      const totalPoints = totalResultsPoints;

      return {
        id: pilot.id,
        firstname: pilot.user?.firstname ?? "",
        surname: pilot.user?.surname ?? "",
        points: totalPoints,
      };
    }) ?? [];

  const sortedPilots = pilotsWithPoints.sort((a, b) => b.points - a.points);

    return (
        <div>
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
             <table className="min-w-full bg-gray-900 text-white rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-800 text-left">
            <th className="px-4 py-2">Место</th>
            <th className="px-4 py-2">Имя Фамилия</th>
            <th className="px-4 py-2">Очки</th>
          </tr>
        </thead>
        <tbody>
          {sortedPilots.map((pilot, index) => (
            <tr
              key={pilot.id}
              className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}
            >
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">
                {pilot.firstname} {pilot.surname}
              </td>
              <td className="px-4 py-2">{pilot.points}</td>
            </tr>
          ))}
        </tbody>
      </table>

        </div>
    )
}