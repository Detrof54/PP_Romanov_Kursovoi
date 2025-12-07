"use client"

import ProtocolAndPenalty from "./ProtocolAndPenalty"
import RezultWeeks from "./rezultWeeks"

interface interfaseProps{
    idJudicalorAdmin: string | undefined,
    flag: boolean,
}

export default function RezultProtocol({idJudicalorAdmin,flag}:interfaseProps){



    return (
        <div className="bg-gray-900 p-4 text-white">
            <RezultWeeks/>
            <ProtocolAndPenalty idJudicalorAdmin = {idJudicalorAdmin} flag = {flag}/>
        </div>
    )
}