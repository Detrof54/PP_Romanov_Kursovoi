"use client";

import { api } from "~/trpc/react";
import { useSearchParams } from "next/navigation";
import SearchInput from "~/app/ui/searchInput";
import Pagination from "~/app/ui/pagination";

export function SearchJudge() {
  const searchParams = useSearchParams();

  const query = searchParams.get("query")?.toLowerCase() || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 5; // количество судей на странице

  const { data: judges, isLoading, error } = api.judgesRouter.getJudges.useQuery();

  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка загрузки</p>;
  if (!judges || judges.length === 0) return <p>Нет судей</p>;

  // фильтрация по имени и фамилии
  const filteredJudges = judges.filter((judge) => {
    const fullname = `${judge.user?.firstname ?? ""} ${judge.user?.surname ?? ""}`.toLowerCase();
    return fullname.includes(query);
  });

  // пагинация
  const totalPages = Math.ceil(filteredJudges.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJudges = filteredJudges.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      {/* поле поиска */}
      <SearchInput placeholder="Найти судью..." paramString="query" />

      {/* результаты поиска */}
      <ul className="divide-y divide-gray-200 border rounded-md">
        {paginatedJudges.length === 0 && (
          <li className="p-3 text-gray-500">Ничего не найдено</li>
        )}
        {paginatedJudges.map((judge) => {
          const fullname =
            `${judge.user?.firstname ?? ""} ${judge.user?.surname ?? ""}`.trim() ||
            "Без имени";

          return (
            <li key={judge.id} className="flex items-center gap-3 p-3">
              <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
                {judge.user?.image ? (
                  <img
                    src={judge.user.image}
                    alt={fullname}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-600">
                    {judge.user?.firstname?.[0] ?? "?"}
                    {judge.user?.surname?.[0] ?? ""}
                  </span>
                )}
              </div>
              <span className="font-medium">{fullname}</span>
            </li>
          );
        })}
      </ul>

      {/* пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}