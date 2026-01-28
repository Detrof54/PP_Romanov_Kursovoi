"use client";

import { X } from "lucide-react";

type ParticipantModalProps = {
  participant: {
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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {participant.firstname} {participant.surname}
          </h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium">Рейтинг:</span>{" "}
            {participant.rating}
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

        {/* Footer */}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="rounded-md bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}