"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface Props {
  pilot: {
    id: string;
    license: string | null;
    birthDate: Date;
    start_number: number;
  };
}

export function EditPilotProfileModal({ pilot }: Props) {
  const [open, setOpen] = useState(false);
  const [license, setLicense] = useState(pilot.license ?? "");
  const [birthDate, setBirthDate] = useState<Date>(pilot.birthDate);
  const [startNumber, setStartNumber] = useState(pilot.start_number);

  const updatePilotProfile =
    api.userProfileRouter.updatePilotProfile.useMutation({
      onSuccess: () => setOpen(false),
    });

  return (
    <>
      <button onClick={() => setOpen(true)} className="mt-4 text-blue-400">
        Редактировать данные пилота
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl mb-4">Профиль пилота</h2>

            <input
              className="w-full mb-2 p-2 bg-gray-700 rounded"
              placeholder="Лицензия"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
            />

            <input
                type="date"
                value={birthDate.toISOString().split("T")[0]}
                onChange={(e) => setBirthDate(new Date(e.target.value))}
            />

            <input
              type="number"
              className="w-full mb-4 p-2 bg-gray-700 rounded"
              value={startNumber}
              onChange={(e) => setStartNumber(Number(e.target.value))}
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)}>Отмена</button>
              <button
                className="text-green-400"
                onClick={() =>
                  updatePilotProfile.mutate({
                    id_pilot: pilot.id,
                    license,
                    birthDate: birthDate,
                    start_number: startNumber,
                  })
                }
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}