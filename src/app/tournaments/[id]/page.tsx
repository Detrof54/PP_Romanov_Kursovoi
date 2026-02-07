"use server";

import Tournir from "~/app/_components/tournamets/Tournir";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
    const session = await auth();
    const idTournir = params.id

    return (
        <div className="min-h-screen bg-gray-900 p-4 text-white">
            <Tournir role={session?.user.role} idTournir = {idTournir} />
        </div>
    );
}