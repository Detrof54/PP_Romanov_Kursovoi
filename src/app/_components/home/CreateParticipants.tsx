import { useState } from "react";
import { api } from "~/trpc/react";

type Props = {
  onCancel: () => void;
};

export function CreateParticipants ({ onCancel }: Props){
  const [firstname, setFirstname] = useState("");
  const [surname, setSurname] = useState("");
  const [rating, setRating] = useState<number | "">("");

  const createParticipant = api.homeRouter.createParticipant.useMutation({
    onSuccess: () => {
      setFirstname("");
      setSurname("");
      setRating("");
      onCancel(); 
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createParticipant.mutate({
      firstname,
      surname,
      rating: rating === "" ? undefined : Number(rating),
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-sm">
      <div>
        <label>Имя</label>
        <input
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label>Фамилия</label>
        <input
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label>Рейтинг</label>
        <input
          type="number"
          value={rating}
          onChange={(e) =>
            setRating(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="border p-2 w-full"
        />
      </div>

      <button
        type="submit"
        disabled={createParticipant.isPending}
        className="bg-black text-white px-4 py-2"
        >
        {createParticipant.isPending ? "Добавление..." : "Подтвердить"}
      </button>
              <button
          type="button"
          onClick={onCancel}
          className="
            px-4 py-2 rounded-lg
            border border-red-300
            text-red-600
            hover:bg-red-100
            transition
          "
        >
          Отмена
        </button>
      {createParticipant.error && (
        <p className="text-red-500">{createParticipant.error.message}</p>
      )}
    </form>
  );
};