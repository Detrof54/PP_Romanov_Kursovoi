"use server";

import { SearchJudge } from "~/app/_components/judicial/SearchJudge";
import RezultProtocol from "../_components/judicial/rezultProtocol";
import { getiDJudical, isAdmin, isJudical } from "../api/auth/check";

export default async function Page(){
    let flag = await isAdmin() || await isJudical()
    let idJudicalorAdmin = await getiDJudical();

    return (
        <div className = "min-h-screen bg-gray-900 p-4 text-white flex flex-col gap-6">
            <SearchJudge />
            <RezultProtocol idJudicalorAdmin = {idJudicalorAdmin} flag = {flag}/>
            
        </div>
    )
}