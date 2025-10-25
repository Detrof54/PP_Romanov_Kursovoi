"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface EditWeekendModalProps {
  weekend: {
    id: string;
    nameTrassa: string;
    city: string;
    dateStart: string;
    dateEnd: string;
    events: {
      id: string;
      type: "TEST_RACE" | "QUALIFICATION" | "RACE";
      data: string;
    }[];
  };
  onClose: () => void;
  onUpdated: () => void;
}

export default function UpdateStage({ weekend, onClose, onUpdated }: EditWeekendModalProps) {
  const [form, setForm] = useState({
    nameTrassa: weekend.nameTrassa,
    city: weekend.city,
    dateStart: weekend.dateStart.split("T")[0],
    dateEnd: weekend.dateEnd.split("T")[0],
  });

  const [events, setEvents] = useState<Record<"TEST_RACE" | "QUALIFICATION" | "RACE", string>>({
    TEST_RACE: weekend.events.find((e) => e.type === "TEST_RACE")?.data.split("T")[0] || "",
    QUALIFICATION: weekend.events.find((e) => e.type === "QUALIFICATION")?.data.split("T")[0] || "",
    RACE: weekend.events.find((e) => e.type === "RACE")?.data.split("T")[0] || "",
  });

  const updateWeekend = api.calendarRouter.updateWeekend.useMutation({
    onSuccess: () => {
      onUpdated();
      onClose();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const eventsArray = Object.entries(events)
      .filter(([_, date]) => date)
      .map(([type, date]) => ({
        type: type as "TEST_RACE" | "QUALIFICATION" | "RACE",
        data: date!,
      }));

    if (
      !form.nameTrassa.trim() ||
      !form.city.trim() ||
      !form.dateStart ||
      !form.dateEnd
    ) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    await updateWeekend.mutateAsync({
      id: weekend.id,
      nameTrassa: form.nameTrassa.trim(),
      city: form.city.trim(),
      dateStart: form.dateStart,
      dateEnd: form.dateEnd,
      events: eventsArray,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Редактировать этап</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Название трассы</label>
            <input
              type="text"
              value={form.nameTrassa}
              onChange={(e) => setForm({ ...form, nameTrassa: e.target.value })}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Город</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Дата начала</label>
            <input
              type="date"
              value={form.dateStart}
              onChange={(e) => setForm({ ...form, dateStart: e.target.value })}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Дата окончания</label>
            <input
              type="date"
              value={form.dateEnd}
              onChange={(e) => setForm({ ...form, dateEnd: e.target.value })}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <p className="font-semibold mt-4">События</p>
          {(["TEST_RACE", "QUALIFICATION", "RACE"] as const).map((type) => (
            <div key={type}>
              <label className="block text-sm mb-1">{type}</label>
              <input
                type="date"
                value={events[type]}
                onChange={(e) =>
                  setEvents((prev) => ({ ...prev, [type]: e.target.value }))
                }
                className="w-full p-2 rounded bg-gray-700 text-white"
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
              disabled={updateWeekend.isPending}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500"
            >
              {updateWeekend.isPending ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}