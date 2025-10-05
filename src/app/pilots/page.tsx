"use server";

import { TablePilots } from "../_components/pilots/TablePilots";
import {SearchPilot} from "../_components/pilots/SearchPilot";

export default async function Page(){

    
    return (
        <div className = "min-h-screen bg-gray-900 p-4 text-white flex flex-col gap-6">
            <SearchPilot />
            <TablePilots />
        </div>
    )
}