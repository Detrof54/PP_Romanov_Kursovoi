"use client"
import type { $Enums } from "@prisma/client";
import { EditBaseProfileModal } from "./EditBaseProfileModal";
import { EditPilotProfileModal } from "./EditPilotProfileModal";
import { DeleteProfileButton } from "./DeleteProfileButton";

interface PilotProfileProps {
  user_pilot: {
    id: string;
    firstname: string | null;
    surname: string | null;
    email: string | null;
    image: string | null;
    role: $Enums.Role;
    pilot: {
      id: string;
      license: string | null;
      start_number: number;
      birthDate: Date;
      penalties: { id: string }[];
    } | null;
  }
}


export function PilotProfile( {user_pilot} : PilotProfileProps) {

  return (
    <div className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
      <img
        src={user_pilot.image ?? "/default-avatar-pilot.jpg"}
        alt="pilot avatar"
        className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-gray-600"
      />
      <h2 className="text-2xl font-semibold mt-4">
        {user_pilot.firstname && user_pilot.surname ? `${user_pilot.firstname} ${user_pilot.surname}` : "No name"}
      </h2>
      <p className="text-gray-400">{user_pilot.email ? user_pilot.email : "no email"}</p>
      <p className="text-sm text-gray-500 mt-2">Роль: Пилот</p>
      <p className="text-gray-400">Лицензия: {user_pilot.pilot?.license ?? "—"}</p>
      <p className="text-gray-400">Стартовый номер: {user_pilot.pilot?.start_number ?? "—"}</p>
      <p className="text-gray-400">
        Дата рождения: {user_pilot.pilot?.birthDate ? new Date(user_pilot.pilot?.birthDate).toLocaleDateString():"—"}
      </p>

      <EditBaseProfileModal user={user_pilot} />

      {user_pilot.pilot && (
        <EditPilotProfileModal pilot={user_pilot.pilot} />
      )}

      <DeleteProfileButton
        userId={user_pilot.id}
        pilotId={user_pilot.pilot?.id}
      />
    </div>
  )
}