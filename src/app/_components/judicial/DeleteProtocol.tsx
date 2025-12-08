"use client";


import { useState } from "react";
import { api } from "~/trpc/react";

export default function DeleteProtocol({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);

  const deleteMutation = api.judgesRouter.DeleteProtocol.useMutation({
    onSuccess: () => {
      alert("Протокол успешно удалён");
      setLoading(false);
    },
    onError: () => {
      alert("Ошибка при удалении протокола");
      setLoading(false);
    },
  });

  const handleDelete = () => {
    if (loading) return;

    if (!confirm("Вы уверены, что хотите удалить протокол?")) return;

    setLoading(true);

    deleteMutation.mutate({ event_id: eventId });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`
        px-4 py-2 
        bg-red-600 hover:bg-red-700 
        text-white font-medium 
        rounded-md 
        transition
        ${loading ? "opacity-60 cursor-not-allowed" : ""}
      `}
    >
      {loading ? "Удаление..." : "Удалить протокол"}
    </button>
  );
}
