interface PilotProfileProps {
  pilot: {
    license?: string | null;
    start_number: number;
    birthDate: string | Date;
    penalties: { id: string }[];
    user?: {
      firstname?: string | null;
      surname?: string | null;
      image?: string | null;
    } | null;
  }
}

export function PilotProfile({ pilot }: PilotProfileProps) {
  const fullname = `${pilot.user?.firstname ?? ""} ${pilot.user?.surname ?? ""}`.trim();

  return (
    <div className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
      <img
        src={pilot.user?.image ?? "/default-avatar-pilot.jpg"}
        alt="pilot avatar"
        className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-gray-600"
      />
      <h2 className="text-2xl font-semibold mt-4">{fullname}</h2>
      <p className="text-gray-400">Лицензия: {pilot.license ?? "—"}</p>
      <p className="text-gray-400">Стартовый номер: {pilot.start_number}</p>
      <p className="text-gray-400">
        Дата рождения: {new Date(pilot.birthDate).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-500 mt-2">Штрафов: {pilot.penalties.length}</p>
    </div>
  )
}