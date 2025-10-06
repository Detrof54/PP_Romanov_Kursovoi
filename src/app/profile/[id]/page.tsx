"use server";

import { api } from "~/trpc/server";
import { UserProfile } from "~/app/_components/profile/UserProfile";
import { PilotProfile } from "~/app/_components/profile/PilotProfile";
import { JudgeProfile } from "~/app/_components/profile/JudgeProfile";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = params;

  // Запрашиваем пользователя с ролями и связями
  const user = await api.userProfileRouter.getUserById({ id });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        <p>Пользователь не найден</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      {<UserProfile user={user} />}
      {user.role === "PILOT" && user.pilot && <PilotProfile pilot={user.pilot} />}
      {user.role === "JUDGE" && user.judge && <JudgeProfile judge={user.judge} />}
    </div>
  );
}