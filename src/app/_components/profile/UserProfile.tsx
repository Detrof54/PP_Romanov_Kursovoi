"use client"
import type { $Enums, Role, TypeStage } from "@prisma/client";
import { EditBaseProfileModal } from "./EditBaseProfileModal";
import { DeleteProfileButton } from "./DeleteProfileButton";
import Link from "next/link";

interface Turnir{
  id: string;
  nameTurnir: string;
  description: string | null;
  stage: $Enums.TypeStage;
  participantsCount: number;
  groupsCount: number;
  tiebreakType: $Enums.TiebreakType;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
}

interface UserProfileProps {
  user: {
    id: string,
    firstname?: string | null;
    surname?: string | null;
    email?: string | null;
    image?: string | null;
    role: $Enums.Role;
    tournaments: Turnir []
  };
}

export function PerevodStage(stage: TypeStage):string{
  if(stage === "GROUP")
    return "Групповой этап"
  if(stage === "BRACKET")
    return "Этап на выбывание"
  if(stage === "FINISHED")
    return "Турнир завершен"
  return "Этап не указан"
}

export function PerevodRole(role: Role):string{
  if(role === "USER")
    return "Пользователь"
  if(role === "ADMIN")
    return "Администратор"
  if(role === "ORGANIZER")
    return "Организатор"
  return "Нет роли"
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
      <img
        src={user.image ?? "/default-avatar.jpg"}
        alt="user avatar"
        className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-gray-600"
      />
      <h2 className="text-2xl font-semibold mt-4">
        {user.firstname && user.surname ? `${user.firstname} ${user.surname}` : "No name"}
      </h2>
      <p className="text-gray-400">{user.email ? user.email : "no email"}</p>
      <p className="text-sm text-gray-500 mt-2">Роль: PerevodRole(user.role)</p>

      <EditBaseProfileModal user={user} />

      <DeleteProfileButton userId={user.id} />

      {user.role === "ORGANIZER" && 
        user.tournaments.length === 0 ? null : (
           user.tournaments.map((tournir: Turnir) => {
            return (
              <Link key={tournir.id} href={`/tournaments/${tournir.id}`} className="block">
                <p className="text-gray-400">{tournir.nameTurnir}  {tournir.stage}</p>
              </Link>
            )
           })
        )
      }
    </div>
  );
}