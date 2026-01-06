"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function DeleteProtocol({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const utils = api.useUtils();

  const deleteMutation = api.judgesRouter.DeleteProtocol.useMutation({
    onSuccess: () => {
      utils.judgesRouter.getCurrentWeekend.invalidate();
      setLoading(false);
      setOpen(false);
    },
    onError: () => {
      alert("Ошибка при удалении протокола");
      setLoading(false);
    },
  });

  const confirmDelete = () => {
    setLoading(true);
    deleteMutation.mutate({ event_id: eventId });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          px-4 py-2 bg-red-600 hover:bg-red-700 
          text-white font-medium rounded-md transition
        "
      >
        Удалить протокол
      </button>

      {open && (
        <div
          className="
            fixed inset-0 bg-black bg-opacity-50 
            flex justify-center items-center z-50 p-4
          "
          onClick={() => !loading && setOpen(false)}
        >
          <div
            className="
              bg-gray-900 text-white p-6 rounded-xl shadow-xl 
              w-full max-w-md relative
            "
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-center">
              Подтверждение удаления
            </h2>

            <p className="text-gray-300 text-center mb-6">
              Вы уверены, что хотите удалить этот протокол?  
              Это действие нельзя отменить.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => !loading && setOpen(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
                disabled={loading}
              >
                Отмена
              </button>

              <button
                onClick={confirmDelete}
                disabled={loading}
                className="
                  px-4 py-2 bg-red-600 hover:bg-red-700 rounded 
                  disabled:opacity-60 disabled:cursor-not-allowed
                "
              >
                {loading ? "Удаление..." : "Удалить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
