"use client";

import { api } from "~/trpc/react";
import { MatchStatus } from "@prisma/client";

export interface Group {
  id: string;
  name: string;
  tournamentId: string;

  participants: {
    id: string;
    tournamentId: string;
    points: number;
    wins: number;
    defeat: number;
    scoreFor: number;
    scoreAgainst: number;
    participantId: string;
    groupId: string | null;
    participant: {
            id: string;
            firstname: string;
            surname: string;
            rating: number;
        };
  }[];

  matches: {
    id: string;
    status: MatchStatus;
    groupId: string;
    round: number;
    playerAId: string;
    playerBId: string;

    result: {
      id: string;
      createdAt: Date;
      scoreA: number;
      scoreB: number;
      winnerId: string;
      groupMatchId: string | null;
    } | null;
  }[];
}

export default function GroupMatchs({ groups }: {groups:Group}){

    return (
        null
    )
}