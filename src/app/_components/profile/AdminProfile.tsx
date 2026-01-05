"use client"
import type { $Enums } from "@prisma/client";
import { EditBaseProfileModal } from "./EditBaseProfileModal";
import { DeleteProfileButton } from "./DeleteProfileButton";

interface AdminProfileProps {
  user_admin: {
    id: string;
    firstname?: string | null;
    surname?: string | null;
    email?: string | null;
    image?: string | null;
    role: $Enums.Role;
  };
}


export function AdminProfile({ user_admin }: AdminProfileProps) {
  return (
    <div className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
      <img
        src={user_admin.image ?? "/default-avatar.jpg"}
        alt="user avatar"
        className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-gray-600"
      />
      <h2 className="text-2xl font-semibold mt-4">
        {user_admin.firstname && user_admin.surname ? `${user_admin.firstname} ${user_admin.surname}` : "No name"}
      </h2>
      <p className="text-gray-400">{user_admin.email ? user_admin.email : "no email"}</p>
      <p className="text-sm text-gray-500 mt-2">Роль: Администратор</p>

      <EditBaseProfileModal user={user_admin} />

      <DeleteProfileButton userId={user_admin.id} />
    </div>
  );
}