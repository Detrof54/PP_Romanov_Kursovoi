interface JudgeProfileProps {
  judge: {
    penalties: { id: string }[];
    user?: {
      login?: string | null;
      firstname?: string | null;
      surname?: string | null;
      image?: string | null;
    } | null;
  };
}

export function JudgeProfile({ judge }: JudgeProfileProps) {
  const fullname = `${judge.user?.firstname ?? ""} ${judge.user?.surname ?? ""}`.trim();


  return (
    <div className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
      <img
        src={judge.user?.image ?? "/default-avatar-judge.jpg"}
        alt="judge avatar"
        className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-gray-600"
      />
      <h2 className="text-2xl font-semibold mt-4">{judge.user?.login}</h2>
      <h2 className="text-2xl font-semibold mt-4">{fullname}</h2>
      <p className="text-gray-400 mt-2">Штрафов выдано: {judge.penalties.length}</p>
    </div>
  );
}