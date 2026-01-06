"use client"

import { useState } from "react";
import { api } from "~/trpc/react";
import EventRezult from "./eventRezult";
import EventPenalty from "./eventPenalty";

export default function RezultWeeks() { 
    const currentDate = new Date().getFullYear();
    const [year, setYear] = useState<number>(currentDate);
    const [visibleWeekends, setVisibleWeekends] = useState<number>(2); 

    const { data: season, isLoading, error } = api.judgesRouter.getListWeekends.useQuery({ year });
    const { data: listSeason } = api.judgesRouter.getListYear.useQuery(); 

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedYear = parseInt(e.target.value);
        setYear(selectedYear);
        setVisibleWeekends(2); 
    };

    const loadMoreWeekends = () => {
        setVisibleWeekends(prev => prev + 2); 
    };

    if (isLoading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка загрузки</p>;
    if (!listSeason) return <p>Список годов отсутствует</p>;
    if (!season) return <p>Сезон не найден</p>;
    if (!season.weekend || season.weekend.length === 0) return <p>Нет этапов в сезоне</p>;

    const visibleWeekendsData = season.weekend.slice(0, visibleWeekends);
    const hasMoreWeekends = visibleWeekends < season.weekend.length;

    return (
        <div className="bg-gray-900 p-4 text-white">
            <div>
                <label htmlFor="yearSelect" className="mr-2">
                    Выберите год:
                </label>
                <select
                    id="yearSelect"
                    value={year}
                    className="bg-gray-800 text-white p-1 rounded"
                    onChange={handleYearChange}
                >
                    {listSeason.map((seasonItem) => (
                        <option key={seasonItem.id} value={seasonItem.year}>
                            {seasonItem.year}
                        </option>
                    ))}
                </select>
            </div>
            
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center">Сезон {year}</h2>
                
                {visibleWeekendsData.map((weekend, index) => (
                    <div key={weekend.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold">
                                Этап {weekend.stage}: {weekend.nameTrassa}
                            </h3>
                            <p className="text-gray-300">
                                {weekend.city} • {weekend.dateStart.toLocaleDateString()} - {weekend.dateEnd.toLocaleDateString()}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {weekend.events.map((event) => (
                                <div key={event.id} className="bg-gray-700 rounded p-3">
                                    <EventRezult results={event.results} eventType={event.type} data={event.data}/>
                                    <EventPenalty penalties={event.penalties}/>
                                </div>
                            ))}
                        </div>
                        {weekend.events.length === 0 && (
                            <p className="text-gray-400 text-center py-4">Нет событий для этого этапа</p>
                        )}
                    </div>
                ))}

                {hasMoreWeekends && (
                    <div className="text-center mt-6">
                        <button
                            onClick={loadMoreWeekends}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Показать еще
                        </button>
                    </div>
                )}

                {!hasMoreWeekends && season.weekend.length > 3 && (
                    <p className="text-gray-400 text-center mt-4">
                        Все этапы сезона показаны
                    </p>
                )}
            </div>
        </div>
    );
}