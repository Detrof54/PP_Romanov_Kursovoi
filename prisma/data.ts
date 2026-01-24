import {BracketType, MatchStatus, Role, TiebreakType, TypeStage } from "@prisma/client";

//====================== USER ==================
//Таблица User 
export const users = [
    {
        id: "user1",
        firstname: "Юзер1",
        surname: "Юзеров1",
        email: "user1@err.com",
        role: Role.USER,
    },
]
//Таблица User (админы)
export const admins = [
    {
        id: "admin1",
        firstname: "Админ1",
        surname: "Админов1",
        email: "admin1@err.com",
        role: Role.ADMIN,
    },
]
//Таблица User (организатор)
export const organizer = [
    {
        id: "organizer1",
        firstname: "Организатор1",
        surname: "Организаторов1",
        email: "organizer1@err.com",
        role: Role.ORGANIZER,
    },
]
//Таблица User (админы)
export const referee= [
    {
        id: "referee1",
        firstname: "Судья1",
        surname: "Судьяя1",
        email: "referee1@err.com",
        role: Role.REFEREE,
    },
]

//====================== PARTICIPANT ==================
export const participants = [
  {
    id: "participant1",
    firstname: "Иван",
    surname: "Иванов",
    rating: 1500,
  },
  {
    id: "participant2",
    firstname: "Пётр",
    surname: "Петров",
    rating: 1450,
  },
  {
    id: "participant3",
    firstname: "Сергей",
    surname: "Сергеев",
    rating: 1600,
  },
]

//================= TURNIR ==================
export const turnirs = [
  {
    id: "turnir1",
    nameTurnir: "Кубок города",
    description: "Тестовый турнир",
    stage: TypeStage.GROUP,
    participantsCount: 3,
    groupsCount: 1,
    tiebreakType: TiebreakType.POINTS,
    createdById: "organizer1",
  },
]

//================= TurnirParticipant ==================
export const turnirParticipants = [
  {
    id: "tp1",
    participantId: "participant1",
    tournamentId: "turnir1",
  },
  {
    id: "tp2",
    participantId: "participant2",
    tournamentId: "turnir1",
  },
  {
    id: "tp3",
    participantId: "participant3",
    tournamentId: "turnir1",
  },
]

//================= GROUP ==================
export const groups = [
  {
    id: "groupA",
    name: "Группа A",
    tournamentId: "turnir1",
  },
]


//================= groupMatches ==================
export const groupMatches = [
  {
    id: "gm1",
    round: 1,
    playerAId: "tp1",
    playerBId: "tp2",
    status: MatchStatus.SCHEDULED,
    groupId: "groupA",
  },
  {
    id: "gm2",
    round: 1,
    playerAId: "tp2",
    playerBId: "tp3",
    status: MatchStatus.SCHEDULED,
    groupId: "groupA",
  },
]


//================= groupMatchResult ==================
export const groupMatchResults = [
  {
    id: "gmr1",
    scoreA: 2,
    scoreB: 1,
    winnerId: "tp1",
    groupMatchId: "gm1",
  },
]

//================= BRACKET ==================
export const brackets = [
  {
    id: "bracket1",
    type: BracketType.UPPER,
    doubleElim: false,
    tournamentId: "turnir1",
  },
]

//================= BracketMatch ==================
export const bracketMatches = [
  {
    id: "bm1",
    round: 1,
    playerAId: "tp1",
    playerBId: "tp3",
    bracketId: "bracket1",
    status: MatchStatus.FINISHED,
  },
]

// ============== BracketMatchResult =================
export const bracketMatchResults = [
  {
    id: "bmr1",
    scoreA: 3,
    scoreB: 0,
    winnerId: "tp1",
    bracketMatchId: "bm1",
  },
]