"use client"
import type { $Enums } from "@prisma/client";
import { EditBaseProfileModal } from "./EditBaseProfileModal";
import { DeleteProfileButton } from "./DeleteProfileButton";

interface JudgeProfileProps {
  user_judge: {
    id: string;
    firstname: string | null;
    surname: string | null;
    email: string | null;
    image: string | null;
    role: $Enums.Role;
    judge: {
      id: string;
      penalties: { id: string }[];
    } | null;
  }
}

export function JudgeProfile({ user_judge }: JudgeProfileProps) {

  return (
    <div className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
      <img
        src={user_judge.image ?? "/default-avatar-pilot.jpg"}
        alt="pilot avatar"
        className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-gray-600"
      />
      <h2 className="text-2xl font-semibold mt-4">
        {user_judge.firstname && user_judge.surname ? `${user_judge.firstname} ${user_judge.surname}` : "No name"}
      </h2>
      <p className="text-gray-400">{user_judge.email ? user_judge.email : "no email"}</p>
      <p className="text-sm text-gray-500 mt-2">Роль: Судья</p>

      <EditBaseProfileModal user={user_judge} />

      <DeleteProfileButton
        userId={user_judge.id}
        judgeId={user_judge.judge?.id}
      />
    </div>
  );
}