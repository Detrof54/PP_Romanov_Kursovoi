"use client";

import { api } from "~/trpc/react";
import { useSearchParams } from "next/navigation";
import SearchInput from "~/app/ui/searchInput";
import Pagination from "~/app/ui/pagination";

export function SearchPilot() {
  const searchParams = useSearchParams();

  const query = searchParams.get("query")?.toLowerCase() || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 5; 

  const { data: pilots, isLoading, error } = api.pilotsRouter.getPilots.useQuery();

  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка загрузки</p>;
  if (!pilots || pilots.length === 0) return <p>Нет пилотов</p>;

  const filteredPilots = pilots.filter((pilot) => {
    const fullname = `${pilot.user?.firstname ?? ""} ${pilot.user?.surname ?? ""}`.toLowerCase();
    return fullname.includes(query);
  });


  const totalPages = Math.ceil(filteredPilots.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPilots = filteredPilots.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <SearchInput placeholder="Найти пилота..." paramString="query" />

      <ul className="divide-y divide-gray-200 border rounded-md">
        {paginatedPilots.length === 0 && (
          <li className="p-3 text-gray-500">Ничего не найдено</li>
        )}
        {paginatedPilots.map((pilot) => {
          const fullname =
            `${pilot.user?.firstname ?? ""} ${pilot.user?.surname ?? ""}`.trim() ||
            "Без имени";

          return (
            <li key={pilot.id} className="flex items-center gap-3 p-3">
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
              <span className="font-medium">{fullname}</span>
            </li>
          );
        })}
      </ul>

      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}