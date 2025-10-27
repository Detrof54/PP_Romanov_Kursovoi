"use client"

import type { Role } from "@prisma/client";

interface User {
  id: string;
  firstname: string | null;
  surname: string | null;
  login: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: Role;
  pilotid: string | null;
  judgeid: string | null;
}

interface Driver {
  id: string;
  birthDate: Date;
  license: string | null;
  start_number: number;
  user: User | null;
}

interface propsPenalties {
  id: string;
  pilotId: string;
  reason: string;
  eventId: string;
  time: number | null;
  createdAt: Date;
  updatedAt: Date;
  judgeId: string;
}


export default function EventPenalty({penalties}:{penalties:propsPenalties[]}){

    return (
        <div className="bg-gray-900 p-4 text-white">
            {penalties.length > 0 && (
                <div className="mt-4">
                    <h5 className="font-medium mb-2 text-red-400">Штрафы:</h5>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-600">
                                    <th className="text-left py-2 px-3">Пилот</th>
                                    <th className="text-left py-2 px-3">Причина</th>
                                    <th className="text-left py-2 px-3">Штрафные секунды</th>
                                </tr>
                            </thead>
                            <tbody>
                                {penalties.map((penalty) => (
                                    <tr key={penalty.id} className="border-b border-gray-600">
                                        <td className="py-2 px-3">Пилот #{penalty.pilotId}</td>
                                        <td className="py-2 px-3">+{penalty.time}с</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}