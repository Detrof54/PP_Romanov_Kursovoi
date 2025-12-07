"use client";

import { api } from "~/trpc/react";
import EventRezult from "./eventRezult";
import EventPenalty from "./eventPenalty";
import AddProtocol from "./AddProtocolAndPenalty";

interface InterfaceProps {
  idJudicalorAdmin?: string;
  flag: boolean;
}

export default function ProtocolAndPenalty({ idJudicalorAdmin, flag }: InterfaceProps) {
  const { data: weekend, isLoading, error } = api.judgesRouter.getCurrentWeekend.useQuery({});

  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка загрузки</p>;
  if (!weekend) return <p>Не гоночная неделя</p>;

  const practice = weekend.events.find((e) => e.type === "TEST_RACE");
  const qualification = weekend.events.find((e) => e.type === "QUALIFICATION");
  const race = weekend.events.find((e) => e.type === "RACE");

  const formatDateTime = (date: string | Date) => {
    const d = date instanceof Date ? date : new Date(date);
    const day = d.getDate();
    const month = d.toLocaleString("ru-RU", { month: "long" });
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${day} ${month}, ${hours}:${minutes}`;
  };

  const judgeId = idJudicalorAdmin || "";

  const renderAddProtocol = (event: typeof practice | typeof qualification | typeof race | undefined) => {
    if (!event || (event.results && event.results.length > 0) || !idJudicalorAdmin || !flag) return null;
    const pilots = weekend.season.pilots ?? [];
    return <AddProtocol eventId={event.id} pilots={pilots} eventType={event.type} judgeId={judgeId} />;
  };

  
  const renderEventCard = (title: string, event: typeof practice | typeof qualification | typeof race | undefined) => (
    <div className="bg-gray-700 rounded p-3 flex flex-col gap-4 w-full">
      <h3 className="text-lg font-semibold text-center">{title}</h3>
      {event ? (
        <>
          <p className="text-gray-300 text-center">{formatDateTime(event.data)}</p>

          {event.results && event.results.length > 0 ? (
            <EventRezult results={event.results} eventType={event.type} data={event.data} />
          ) : (
            <p className="text-gray-400 text-center">Результатов нет</p>
          )}

          {event.penalties && event.penalties.length > 0 ? (
            <EventPenalty penalties={event.penalties} />
          ) : (
            <p className="text-gray-400 text-center">Штрафов нет</p>
          )}

          {renderAddProtocol(event)}
        </>
      ) : (
        <p className="text-gray-400 text-center">Не назначено</p>
      )}
    </div>
  );

  return (
    <div className="bg-gray-900 p-4 text-white w-full flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold text-center mb-4">
        {weekend.city} — {weekend.nameTrassa} ({weekend.season.year})
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {renderEventCard("Тренировка", practice)}
        {renderEventCard("Квалификация", qualification)}
        {renderEventCard("Гонка", race)}
      </div>
    </div>
  );
}
