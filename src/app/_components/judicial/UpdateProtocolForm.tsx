"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import type { EventProps } from "./UpdateProtocol";

export default function UpdateProtocolForm({
  event,
  judgeId,
  onClose,
}: {
  event: EventProps;
  judgeId: string;
  onClose: () => void;
}) {
  const { id: eventId, type: eventType, results, penalties } = event;

  const utils = api.useUtils();

  // --- 1. Загружаем старые данные в state ---
  const [rows, setRows] = useState(() =>
    results.map((r: any) => ({
      pilotId: r.pilotId,
      bestLap: r.bestLap?.toString() || "",
      totalTime: r.totalTime?.toString() || "",
      penalty:
        penalties.find((p: any) => p.pilotId === r.pilotId) || null,
    }))
  );

  const [penaltyRows, setPenaltyRows] = useState(() =>
    penalties.map((p: any) => ({
      id: p.id,
      pilotId: p.pilotId,
      time: p.time !== null ? p.time.toString() : "",
      reason: p.reason,
    }))
  );

  const updateMutation = api.judgesRouter.updateFullProtocol.useMutation({
    onSuccess: () => {
      utils.judgesRouter.getCurrentWeekend.invalidate();
      onClose();
    },
  });

  const handleResultChange = (pilotId: string, field: string, value: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.pilotId === pilotId ? { ...r, [field]: value } : r
      )
    );
  };

  const handlePenaltyChange = (id: string, field: string, value: string) => {
    setPenaltyRows((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  const submit = () => {
    const resultsPayload = rows.map((r) => ({
      pilotId: r.pilotId,
      bestLap: Number(r.bestLap) || null,
      totalTime: eventType === "RACE" ? Number(r.totalTime) || null : null,
    }));

    const penaltiesPayload = penaltyRows.map((p) => ({
      id: p.id,
      pilotId: p.pilotId,
      time: Number(p.time),
      reason: p.reason,
    }));

    updateMutation.mutate({
      eventId,
      judgeId,
      eventType,
      results: resultsPayload,
      penalties: penaltiesPayload,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4 z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-4xl text-white overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4 text-center">
          Обновление протокола
        </h2>

        {/* === Results === */}
        <div className="flex flex-col gap-4">
          {rows.map((row) => (
            <div
              key={row.pilotId}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-800 rounded-lg"
            >
              <p className="font-semibold">
                {
                event.results.find((r) => r.pilotId === row.pilotId)
                    ?.driver.user?.surname ?? ""
                }{" "}
                {
                event.results.find((r) => r.pilotId === row.pilotId)
                    ?.driver.user?.firstname ?? ""
                }

              </p>

              {/* Best Lap */}
              <input
                className="p-2 bg-gray-700 rounded"
                value={row.bestLap}
                onChange={(e) =>
                  handleResultChange(row.pilotId, "bestLap", e.target.value)
                }
                placeholder="Быстрый круг"
              />

              {/* Total Time (только RACE) */}
              {eventType === "RACE" && (
                <input
                  className="p-2 bg-gray-700 rounded"
                  value={row.totalTime}
                  onChange={(e) =>
                    handleResultChange(row.pilotId, "totalTime", e.target.value)
                  }
                  placeholder="Общее время"
                />
              )}
            </div>
          ))}
        </div>

        {/* === Penalties === */}
        <h3 className="text-lg font-semibold mt-6 mb-2">
          Штрафы
        </h3>

        <div className="flex flex-col gap-4">
          {penaltyRows.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-800 rounded-lg"
            >
              <input
                className="p-2 bg-gray-700 rounded"
                value={p.time}
                onChange={(e) =>
                  handlePenaltyChange(p.id!, "time", e.target.value)
                }
                placeholder="Штраф (сек)"
              />

              <input
                className="p-2 bg-gray-700 rounded"
                value={p.reason}
                onChange={(e) =>
                  handlePenaltyChange(p.id!, "reason", e.target.value)
                }
                placeholder="Причина"
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
          >
            Отмена
          </button>

          <button
            onClick={submit}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  );
}
