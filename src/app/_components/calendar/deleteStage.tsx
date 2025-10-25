"use client";

import { api } from "~/trpc/react";
import { useState } from "react";

interface DeleteStageModalProps {
  weekendId: string;
  weekendName: string;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteStage({
  weekendId,
  weekendName,
  onClose,
  onDeleted,
}: DeleteStageModalProps) {
  const deleteWeekend = api.calendarRouter.deleteWeekend.useMutation({
    onSuccess: () => {
      onDeleted();
      onClose();
    },
  });

  const [isConfirming, setIsConfirming] = useState(false);

  const handleDelete = async () => {
    setIsConfirming(true);
    try {
      await deleteWeekend.mutateAsync({ weekendId });
    } catch (e) {
      console.error(e);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4 text-white">
          Удалить этап
        </h2>
        <p className="text-gray-300 mb-6">
          Вы действительно хотите удалить этап{" "}
          <span className="font-bold text-red-400">
            «{weekendName || "Без названия"}»
          </span>
          ? Это действие нельзя отменить.
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white"
          >
            Отмена
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteWeekend.isPending || isConfirming}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white"
          >
            {deleteWeekend.isPending || isConfirming
              ? "Удаление..."
              : "Удалить"}
          </button>
        </div>
      </div>
    </div>
  );
}