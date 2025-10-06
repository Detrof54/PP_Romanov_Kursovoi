"use server";

import { SearchJudge } from "~/app/_components/judicial/SearchJudge";

export default async function Page(){

    return (
        <div className = "min-h-screen bg-gray-900 p-4 text-white flex flex-col gap-6">
            <SearchJudge />
        </div>
    )
}