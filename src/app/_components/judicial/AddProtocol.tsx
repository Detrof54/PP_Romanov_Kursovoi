"use client";
import { useState } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent } from "~/app/ui/card";
import type { RaceType } from "@prisma/client";

export interface PilotUser {
  user: {
    firstname: string | null;
    surname: string | null;
  } | null; 
  id: string;
  birthDate: Date;
  license: string | null;
  start_number: number;
}

interface AddProtocolProps {
  eventId: string;
  pilots: PilotUser[];
  eventType: RaceType;
  judgeId: string;
}

type RowField = "bestLap" | "totalTime" | "penaltyTime" | "reason";


export default function AddProtocol({ eventId, pilots, eventType, judgeId }: AddProtocolProps) {
  const [rows, setRows] = useState(() =>
    pilots.map((p) => ({
      pilotId: p.id,
      bestLap: "",
      totalTime: "",
      penaltyTime: "",
      reason: "",
    }))
  );
  
  const utils = api.useUtils(); 

  const createProtocol = api.judgesRouter.createFullProtocol.useMutation({
    onSuccess: () => utils.judgesRouter.getCurrentWeekend.invalidate(),
  });

   const handleChange = (
    pilotId: string,
    field: RowField,
    value: string
  ) => {
    setRows((prev) =>
      prev.map((r) =>
        r.pilotId === pilotId ? { ...r, [field]: value } : r
      )
    );
  };

  const submit = () => {
    const results = rows.map((r) => ({
      pilotId: r.pilotId,
      bestLap: Number(r.bestLap) || null,
      totalTime:
        eventType === "RACE" ? Number(r.totalTime) || null : null,
    }));

    const parsePenaltyTime = (str: string) => {
      const num = Number(str);
      return isNaN(num) ? null : num;
    };

    const penalties = rows
      .filter((r) => r.penaltyTime && r.reason && parsePenaltyTime(r.penaltyTime) !== null)
      .map((r) => ({
        pilotId: r.pilotId,
        time: parsePenaltyTime(r.penaltyTime)!, 
        reason: r.reason,
      }));

    createProtocol.mutate({
      eventId,
      judgeId,
      eventType,
      results,
      penalties,
    });
  };

  return (
    <Card className="bg-gray-900 border border-gray-700 w-full p-4 !bg-gray-900">
      <CardContent className="flex flex-col gap-4 text-white">
        {rows.map((row) => (
          <div
            key={row.pilotId}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center border p-4 rounded-lg"
          >
            <p className="font-semibold">
              {`${pilots.find((p) => p.id === row.pilotId)?.user?.surname ?? ""} ${pilots.find((p) => p.id === row.pilotId)?.user?.firstname ?? ""}`}
            </p>

            <input
              className="p-2 rounded bg-gray-800 border border-gray-600"
              placeholder="Быстрый круг (мм:сс:мс)"
              value={row.bestLap}
              onChange={(e) =>
                handleChange(row.pilotId, "bestLap", e.target.value)
              }
            />

            {eventType === "RACE" && (
              <input
                className="p-2 rounded bg-gray-800 border border-gray-600"
                placeholder="Общее время (мм:сс:мс)"
                value={row.totalTime}
                onChange={(e) =>
                  handleChange(row.pilotId, "totalTime", e.target.value)
                }
              />
            )}

            <div className="flex flex-col gap-2">
              <input
                className="p-2 rounded bg-gray-800 border border-gray-600"
                placeholder="Штраф (сек)"
                value={row.penaltyTime}
                onChange={(e) =>
                  handleChange(row.pilotId, "penaltyTime", e.target.value)
                }
              />
              <input
                className="p-2 rounded bg-gray-800 border border-gray-600"
                placeholder="Причина штрафа"
                value={row.reason}
                onChange={(e) =>
                  handleChange(row.pilotId, "reason", e.target.value)
                }
              />
            </div>
          </div>
        ))}

        <button
          onClick={submit}
          className="mt-4 p-3 bg-green-600 rounded hover:bg-green-700 font-semibold"
        >
          Сохранить результаты
        </button>
      </CardContent>
    </Card>
  );
}
