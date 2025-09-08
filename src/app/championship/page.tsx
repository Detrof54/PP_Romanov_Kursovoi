"use server";

import { api } from "~/trpc/server";
import { PersonalСreditTable } from "../_components/championship/PersonalСreditTable";

export default async function Page() {

    const years: number[] = await api.championshipRouter.getListYearBeforeCurrent();

    return (
        <div className="min-h-screen bg-gray-900 p-4 text-white">
            <PersonalСreditTable years = {years} />
        </div>
    );
}