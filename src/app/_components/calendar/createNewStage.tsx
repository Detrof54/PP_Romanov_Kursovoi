"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface CreateWeekendModalProps {
  seasonId: string;
  stage: number;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateNewStage({ seasonId, stage, onClose, onCreated }: CreateWeekendModalProps) {
  const [form, setForm] = useState({
    nameTrassa: "",
    city: "",
  });

  const [events, setEvents] = useState<{ TEST_RACE: string; QUALIFICATION: string; RACE: string }>({
    TEST_RACE: "",
    QUALIFICATION: "",
    RACE: "",
  });

  const [errors, setErrors] = useState<string | null>(null);

  const createWeekend = api.calendarRouter.createWeekend.useMutation({
    onSuccess: () => {
      onCreated();
      onClose();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors(null);

    if (!form.nameTrassa.trim() || !form.city.trim()) {
      setErrors("Поля 'Название трассы' и 'Город' обязательны.");
      return;
    }

    if (!events.TEST_RACE || !events.QUALIFICATION || !events.RACE) {
      setErrors("Укажите все даты: тестовые заезды, квалификацию и гонку.");
      return;
    }

    const eventsArray = Object.entries(events).map(([type, date]) => ({
      type: type as "TEST_RACE" | "QUALIFICATION" | "RACE",
      data: date,
    }));

    const eventDates = eventsArray.map((e) => new Date(e.data));
    const dateStart = eventDates.reduce((a, b) => (a < b ? a : b)).toISOString().split("T")[0] || "";
    const dateEnd = eventDates.reduce((a, b) => (a > b ? a : b)).toISOString().split("T")[0] || "";

    await createWeekend.mutateAsync({
      seasonId,
      stage,
      nameTrassa: form.nameTrassa.trim(),
      city: form.city.trim(),
      dateStart,
      dateEnd,
      events: eventsArray,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Добавить новый этап</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors && <div className="text-red-400 text-sm font-semibold">{errors}</div>}

          <div>
            <label className="block text-sm mb-1">Название трассы *</label>
            <input
              type="text"
              value={form.nameTrassa}
              onChange={(e) => setForm({ ...form, nameTrassa: e.target.value })}
              className={`w-full p-2 rounded bg-gray-700 text-white border ${
                !form.nameTrassa.trim() && errors ? "border-red-500" : "border-transparent"
              }`}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Город *</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className={`w-full p-2 rounded bg-gray-700 text-white border ${
                !form.city.trim() && errors ? "border-red-500" : "border-transparent"
              }`}
              required
            />
          </div>

          <p className="font-semibold mt-4">События *</p>
          {(["TEST_RACE", "QUALIFICATION", "RACE"] as const).map((type) => (
            <div key={type}>
              <label className="block text-sm mb-1">
                {type === "TEST_RACE"
                  ? "Тестовые заезды"
                  : type === "QUALIFICATION"
                  ? "Квалификация"
                  : "Гонка"}{" "}
                *
              </label>
              <input
                type="datetime-local"
                value={events[type]}
                onChange={(e) => setEvents((prev) => ({ ...prev, [type]: e.target.value }))}
                className={`w-full p-2 rounded bg-gray-700 text-white border ${
                  !events[type] && errors ? "border-red-500" : "border-transparent"
                }`}
                required
              />
            </div>
          ))}

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={createWeekend.isPending}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
            >
              {createWeekend.isPending ? "Создание..." : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}