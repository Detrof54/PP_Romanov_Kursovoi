"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface Season {
  id: string;
  year: number;
}

export default function SeasonManager() { 
  const { data: seasons, isLoading, error, refetch } = api.calendarRouter.getListYearRead.useQuery();
  const createSeason = api.calendarRouter.createSeason.useMutation();
  const updateSeason = api.calendarRouter.updateSeason.useMutation();
  const deleteSeason = api.calendarRouter.deleteSeason.useMutation();

  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Season | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Season | null>(null);
  const [yearInput, setYearInput] = useState("");

  // 🧱 Создание сезона
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!yearInput) return;
    await createSeason.mutateAsync({ year: Number(yearInput) });
    setYearInput("");
    setShowCreate(false);
    refetch();
  };

  // ✏️ Обновление сезона
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    await updateSeason.mutateAsync({ id: editTarget.id, year: Number(yearInput) });
    setEditTarget(null);
    setYearInput("");
    refetch();
  };

  // 🗑️ Удаление сезона
  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteSeason.mutateAsync({ id: deleteTarget.id });
    setDeleteTarget(null);
    refetch();
  };

  if (isLoading) return <div>Загрузка сезонов...</div>;
  if (error) return <div>Ошибка: {(error as any)?.message || "Не удалось загрузить сезоны"}</div>;

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Управление сезонами</h2>

      {/* Список сезонов */}
      <ul className="space-y-2 mb-6">
        {seasons?.map((s) => (
          <li
            key={s}
            className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-md"
          >
            <span className="text-lg font-medium">{s}</span>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditTarget({ id: s.toString(), year: s });
                  setYearInput(String(s));
                }}
                className="text-blue-400 hover:text-blue-300"
              >
                ✏️
              </button>
              <button
                onClick={() =>
                  setDeleteTarget({ id: s.toString(), year: s })
                }
                className="text-red-500 hover:text-red-400"
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* ➕ Кнопка добавить */}
      {!showCreate && !editTarget && (
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition"
        >
          ➕ Добавить сезон
        </button>
      )}

      {/* 📅 Форма создания/редактирования */}
      {(showCreate || editTarget) && (
        <form
          onSubmit={editTarget ? handleUpdate : handleCreate}
          className="mt-4 bg-gray-800 p-4 rounded-md space-y-3"
        >
          <label className="block text-sm">Год сезона:</label>
          <input
            type="number"
            value={yearInput}
            onChange={(e) => setYearInput(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-700 text-white"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowCreate(false);
                setEditTarget(null);
                setYearInput("");
              }}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
            >
              {editTarget ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      )}

      {/* ⚠️ Модалка удаления */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-sm">
            <h3 className="text-xl font-semibold mb-4">
              Удалить сезон {deleteTarget.year}?
            </h3>
            <p className="text-gray-400 mb-4">
              Это действие нельзя отменить.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
              >
                Отмена
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}