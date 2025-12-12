"use client";

import { useState } from "react";

import type { RaceType } from "@prisma/client";
import UpdateProtocolForm from "./UpdateProtocolForm";

export interface User {
  id: string;
  firstname: string | null;
  surname: string | null;
  login: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: string;
  pilotid: string | null;
  judgeid: string | null;
}

export interface Pilot {
  id: string;
  birthDate: Date;
  license: string | null;
  start_number: number;
  user: User | null;
}

export interface EventResult {
  id: string;
  eventId: string;
  pilotId: string;

  bestLap: number | null;
  totalTime: number;
  pozition: number;
  points: number;

  driver: Pilot;
}

export interface EventPenalty {
  id: string;
  eventId: string;
  pilotId: string;
  judgeId: string;

  reason: string;
  time: number | null;

  pilot: Pilot;
}

export interface EventProps {
  id: string;
  type: RaceType;
  data: string | Date;

  results: EventResult[];
  penalties: EventPenalty[];
}

interface Props{
    event:EventProps,
    judgeId: string,
}

export default function UpdateProtocol({ event, judgeId }: Props) {
  const [open, setOpen] = useState(false);

  if (!event) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
      >
        Обновить протокол
      </button>

      {open && (
        <UpdateProtocolForm
          event={event}
          judgeId={judgeId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}