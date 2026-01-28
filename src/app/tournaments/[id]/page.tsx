"use server";

import { auth } from "~/server/auth";
import { api } from "~/trpc/server";


export default async function Page() {
    const session = await auth();

    return (
        <div className="min-h-screen bg-gray-900 p-4 text-white">
            
        </div>
    );
}