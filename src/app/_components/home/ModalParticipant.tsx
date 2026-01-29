"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { api } from "~/trpc/react";

type ParticipantModalProps = {
  participant: {
    id: string;
    firstname: string;
    surname: string;
    rating: number;
    tournaments: {
      tournament: {
        id: string;
        nameTurnir: string;
      };
    }[];
  };
  onClose: () => void;
};

export default function ModalParticipant({
  participant,
  onClose,
}: ParticipantModalProps) {
  const [isEdit, setIsEdit] = useState(false);

  const [firstname, setFirstname] = useState(participant.firstname);
  const [surname, setSurname] = useState(participant.surname);
  const [rating, setRating] = useState<number | "">(participant.rating);

  const updateParticipant =
    api.homeRouter.updateParticipant.useMutation({
      onSuccess: () => setIsEdit(false),
    });

  const deleteParticipant =
    api.homeRouter.deleteParticipant.useMutation({
      onSuccess: onClose,
    });

  const handleUpdate = () => {
    updateParticipant.mutate({
      id: participant.id,
      firstname,
      surname,
      rating: rating === "" ? undefined : rating,
    });
  };

  const handleDelete = () => {
    if (!confirm("Удалить участника?")) return;
    deleteParticipant.mutate({ id: participant.id });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          {isEdit ? (
            <div className="flex gap-2">
              <input
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="w-32 rounded border px-2 py-1"
              />
              <input
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-32 rounded border px-2 py-1"
              />
            </div>
          ) : (
            <h2 className="text-lg font-semibold">
              {participant.firstname} {participant.surname}
            </h2>
          )}

          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-500 hover:text-black" />
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium">Рейтинг:</span>{" "}
            {isEdit ? (
              <input
                type="number"
                value={rating}
                onChange={(e) =>
                  setRating(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="ml-2 w-24 rounded border px-2 py-1"
              />
            ) : (
              participant.rating
            )}
          </div>

          <div>
            <span className="font-medium">Турниры:</span>
            {participant.tournaments.length === 0 ? (
              <p className="text-gray-500">Нет участий</p>
            ) : (
              <ul className="mt-1 list-inside list-disc">
                {participant.tournaments.map((tp) => (
                  <li key={tp.tournament.id}>
                    {tp.tournament.nameTurnir}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={handleDelete}
            disabled={deleteParticipant.isPending}
            className="rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 disabled:opacity-50"
          >
            Удалить
          </button>

          <div className="flex gap-2">
            {isEdit ? (
              <>
                <button
                  onClick={() => setIsEdit(false)}
                  className="rounded-md bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
                >
                  Отмена
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={updateParticipant.isPending}
                  className="rounded-md bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600 disabled:opacity-50"
                >
                  Сохранить
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
              >
                Редактировать
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
