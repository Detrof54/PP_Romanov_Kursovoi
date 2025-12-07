"use client"

import { RaceType, Role } from "@prisma/client";

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

interface propsRezult {
  id: string;
  totalTime: number;
  points: number;
  bestLap: number | null;
  pozition: number;
  pilotId: string;
  eventId: string;
  driver: Driver;
}

function TypeEvent(eventType:RaceType){
    if(eventType === "QUALIFICATION")
        return "Квалификация"
    else if (eventType === "RACE")
        return "Гонка"
    return "Тестовые заезды"
}

function TimeToFormat(time: number): string {
    if (time < 0 || !isFinite(time)) {
        return "0:00:000";
    }
    
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor(time % 1000);
    
    // Форматируем с ведущими нулями
    const formattedMinutes = minutes.toString();
    const formattedSeconds = seconds.toString().padStart(2, '0');
    const formattedMilliseconds = milliseconds.toString().padStart(3, '0');
    return `${formattedMinutes}:${formattedSeconds}:${formattedMilliseconds}`;
}

export default function EventRezult({results,eventType, data}:{results: propsRezult[], eventType:RaceType, data: Date}){
    const leader = results.find(r => r.pozition === 1);
    const leaderTime = leader?.totalTime ?? 0;
    const poul = leader?.bestLap ?? 0;



    return (
        <div className="bg-gray-900 p-4 text-white">
            <h4 className="font-medium mb-3 text-lg">
                Событие: {TypeEvent(eventType)} • {data.toLocaleDateString()}
            </h4>

            {results.length > 0 ? (
                <div className="overflow-x-auto">

                    {/* --- RACE --- */}
                    {eventType === "RACE" && (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-600">
                                    <th className="text-left py-2 px-3">Место</th>
                                    <th className="text-left py-2 px-3">Пилот</th>
                                    <th className="text-left py-2 px-3">Время</th>
                                    <th className="text-left py-2 px-3">Очки</th>
                                    <th className="text-left py-2 px-3">Лучший круг</th>
                                </tr>
                            </thead>

                            <tbody>
                                {results
                                    .sort((a, b) => a.pozition - b.pozition) // 🔥 сортировка по месту
                                    .map((result) => (
                                        <tr key={result.id} className="border-b border-gray-600 hover:bg-gray-600">
                                            <td className="py-2 px-3">{result.pozition}</td>
                                            <td className="py-2 px-3">
                                                {result.driver.user?.firstname} {result.driver.user?.surname}
                                            </td>
                                            <td className="py-2 px-3">
                                                {result.pozition === 1 ? "Лидер": `+${TimeToFormat(result.totalTime-leaderTime)}`}
                                            </td>
                                            <td className="py-2 px-3">{result.points}</td>
                                            <td className="py-2 px-3">
                                                {result.bestLap ? TimeToFormat(result.bestLap) : "-"}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    )}

                    {/* --- QUALIFICATION & TEST_RACE --- */}
                    {(eventType === "QUALIFICATION" || eventType === "TEST_RACE") && (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-600">
                                    <th className="text-left py-2 px-3">Место</th>
                                    <th className="text-left py-2 px-3">Пилот</th>
                                    <th className="text-left py-2 px-3">Лучший круг</th>
                                    <th className="text-left py-2 px-3">Отставание</th>
                                </tr>
                            </thead>

                            <tbody>
                                {results
                                    .sort((a, b) => a.pozition - b.pozition) // 🔥 сортировка по месту
                                    .map((result) => (
                                        <tr key={result.id} className="border-b border-gray-600 hover:bg-gray-600">
                                            <td className="py-2 px-3">{result.pozition}</td>
                                            <td className="py-2 px-3">
                                                {result.driver.user?.firstname} {result.driver.user?.surname}
                                            </td>
                                            <td className="py-2 px-3">
                                                {result.bestLap ? TimeToFormat(result.bestLap) : "-"}
                                            </td>
                                            <td> {result.bestLap ? result.pozition === 1 ? "Поул":`+${TimeToFormat(result.bestLap-poul)}` : "Нет"} </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    )}

                </div>
            ) : (
                <p className="text-gray-400 text-center py-4">Нет результатов</p>
            )}
        </div>
    );
}