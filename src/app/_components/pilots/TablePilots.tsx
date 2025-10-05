"use client";

import { api } from "~/trpc/react";
import { useSearchParams } from "next/navigation";
import Pagination from "~/app/ui/pagination";

export function TablePilots() {
  const { data: pilots, isLoading, error } =
    api.pilotsRouter.getTablePilots.useQuery();

  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = 5;

  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка загрузки</p>;
  if (!pilots || pilots.length === 0) return <p>Нет пилотов</p>;

  const totalPages = Math.ceil(pilots.length / pageSize);
  const paginatedPilots = pilots.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-left">
            <tr>
              <th className="px-4 py-2 w-12">#</th>
              <th className="px-4 py-2">Пилот</th>
              <th className="px-4 py-2">Сезоны</th>
              <th className="px-4 py-2">Статус</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPilots.map((pilot) => {
              const fullname =
                `${pilot.user?.firstname ?? ""} ${pilot.user?.surname ?? ""}`.trim() ||
                "Без имени";

              const seasons =
                pilot.seasons.length > 0
                  ? pilot.seasons.map((s) => s.year).join(", ")
                  : "Не участвовал";

              const status = "Участник"; // ⚡️ пока заглушка

              return (
                <tr key={pilot.id} className="border-t">
                  <td className="px-4 py-2">
                    <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
                      {pilot.user?.image ? (
                        <img
                          src={pilot.user.image}
                          alt={fullname}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-600">
                          {pilot.user?.firstname?.[0] ?? "?"}
                          {pilot.user?.surname?.[0] ?? ""}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">{fullname}</td>
                  <td className="px-4 py-2">{seasons}</td>
                  <td className="px-4 py-2">{status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* пагинация */}
      <div className="flex justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}