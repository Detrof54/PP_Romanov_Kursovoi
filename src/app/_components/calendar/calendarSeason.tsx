"use client";

import { api } from "~/trpc/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";

import CreateNewStage from "./createNewStage";
import UpdateStage from "./updateStage";
import DeleteStage from "./deleteStage";


interface CalendarSeasonProps {
  years: number[];
  role: "USER" | "PILOT" | "JUDGE" | "ADMIN";
}

export default function CalendarSeason({ years, role }: CalendarSeasonProps) {
  const searchParams = useSearchParams();
  const selectedYearParam = searchParams.get("year");
  const selectedYear = selectedYearParam
    ? Number(selectedYearParam)
    : new Date().getFullYear();

  const { data: season, isLoading, error, refetch } =
    api.calendarRouter.getListWeekends.useQuery({ year: selectedYear });

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editWeekend, setEditWeekend] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as any)?.message || "Ошибка"}</div>;
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
          defaultValue={selectedYear}
          className="bg-gray-800 text-white p-1 rounded"
          onChange={(e) => e.currentTarget.form?.submit()}
        >
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
            className="border border-gray-700 rounded-xl p-5 bg-gray-800"
          >

            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold">
                {weekend.nameTrassa || "Без названия"}
              </h3>

              {role === "ADMIN" && (
                <div className="flex gap-2">

                  <button
                    onClick={() => {
                      setEditWeekend(weekend);
                      setShowEditModal(true);
                    }}
                    className="text-blue-400 hover:text-blue-300"
                    title="Редактировать"
                  >
                    ✏️
                  </button>


                  <button
                    onClick={() => {
                      setDeleteTarget({
                        id: weekend.id,
                        name: weekend.nameTrassa || "Без названия",
                      });
                      setShowDeleteModal(true);
                    }}
                    className="text-red-500 hover:text-red-400"
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>

            <p className="text-gray-400 text-sm mb-1">
              <span className="font-medium text-gray-300">Город:</span>{" "}
              {weekend.city || "—"}
            </p>
            <p className="text-gray-400 text-sm mb-3">
              <span className="font-medium text-gray-300">Даты:</span>{" "}
              {new Date(weekend.dateStart).toLocaleDateString()} —{" "}
              {new Date(weekend.dateEnd).toLocaleDateString()}
            </p>

            <div className="bg-gray-900/60 rounded-lg p-3 mt-2">
              <p className="text-gray-300 text-sm font-semibold mb-1">
                События:
              </p>
              {weekend.events.length > 0 ? (
                <ul className="space-y-1">
                  {weekend.events.map((event) => (
                    <li
                      key={event.id}
                      className="text-gray-400 text-sm flex justify-between border-b border-gray-700/50 pb-1"
                    >
                      <span>
                        {event.type === "TEST_RACE"
                          ? "Тестовые заезды"
                          : event.type === "QUALIFICATION"
                          ? "Квалификация"
                          : event.type === "RACE"
                          ? "Гонка"
                          : ""}
                      </span>
                      <span>{new Date(event.data).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm italic">Событий нет</p>
              )}
            </div>
          </div>
        ))}

        {role === "ADMIN" && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-4 hover:border-white transition"
          >
            <Plus className="w-8 h-8 text-gray-400" />
          </button>
        )}
      </div>

      {showModal && (
        <CreateNewStage
          seasonId={season.id}
          stage={season.weekend.length + 1}
          onClose={() => setShowModal(false)}
          onCreated={refetch}
        />
      )}

      {showEditModal && editWeekend && (
        <UpdateStage
          weekend={editWeekend}
          onClose={() => setShowEditModal(false)}
          onUpdated={refetch}
        />
      )}

      {showDeleteModal && deleteTarget && (
        <DeleteStage
          weekendId={deleteTarget.id}
          weekendName={deleteTarget.name}
          onClose={() => setShowDeleteModal(false)}
          onDeleted={refetch}
        />
      )}
    </div>
  );
}