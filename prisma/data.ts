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
  {
    id: "participant4",
    firstname: "Дмитрий",
    surname: "Смирнов",
    rating: 1450,
  },
  {
    id: "participant5",
    firstname: "Андрей",
    surname: "Кузнецов",
    rating: 1580,
  },
  {
    id: "participant6",
    firstname: "Михаил",
    surname: "Волков",
    rating: 1520,
  },
  {
    id: "participant7",
    firstname: "Никита",
    surname: "Фёдоров",
    rating: 1480,
  },
  {
    id: "participant8",
    firstname: "Евгений",
    surname: "Морозов",
    rating: 1620,
  },
  {
    id: "participant9",
    firstname: "Павел",
    surname: "Соколов",
    rating: 1490,
  },
  {
    id: "participant10",
    firstname: "Владимир",
    surname: "Орлов",
    rating: 1570,
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
  {
    id: "turnir2",
    nameTurnir: "Шахматы",
    description: "Тестовый турнир по шахматам",
    stage: TypeStage.BRACKET,
    participantsCount: 8,
    groupsCount: 2,
    tiebreakType: TiebreakType.HEAD_TO_HEAD,
    createdById: "organizer1",
  },
  {
    id: "turnir3",
    nameTurnir: "Фехтование",
    description: "Тестовый турнир по фехтовани.",
    stage: TypeStage.FINISHED,
    participantsCount: 10,
    groupsCount: 3,
    tiebreakType: TiebreakType.SCORE_DIFF,
    createdById: "organizer1",
  },
]

//================= TurnirParticipant ==================
export const turnirParticipants = [
  //турнир 1
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
  //турнир 2
  {
    id: "tp4",
    participantId: "participant1",
    tournamentId: "turnir2",
  },
  {
    id: "tp5",
    participantId: "participant2",
    tournamentId: "turnir2",
  },
  {
    id: "tp6",
    participantId: "participant3",
    tournamentId: "turnir2",
  },
  {
    id: "tp7",
    participantId: "participant4",
    tournamentId: "turnir2",
  },
  {
    id: "tp8",
    participantId: "participant5",
    tournamentId: "turnir2",
  },
  {
    id: "tp9",
    participantId: "participant6",
    tournamentId: "turnir2",
  },
    {
    id: "tp10",
    participantId: "participant7",
    tournamentId: "turnir2",
  },
  {
    id: "tp11",
    participantId: "participant8",
    tournamentId: "turnir2",
  },
    //турнир 3
  {
    id: "tp12",
    participantId: "participant1",
    tournamentId: "turnir3",
  },
  {
    id: "tp13",
    participantId: "participant2",
    tournamentId: "turnir3",
  },
  {
    id: "tp14",
    participantId: "participant3",
    tournamentId: "turnir3",
  },
  {
    id: "tp15",
    participantId: "participant4",
    tournamentId: "turnir3",
  },
  {
    id: "tp16",
    participantId: "participant5",
    tournamentId: "turnir3",
  },
  {
    id: "tp17",
    participantId: "participant6",
    tournamentId: "turnir3",
  },
    {
    id: "tp18",
    participantId: "participant7",
    tournamentId: "turnir3",
  },
  {
    id: "tp19",
    participantId: "participant8",
    tournamentId: "turnir3",
  },
    {
    id: "tp20",
    participantId: "participant8",
    tournamentId: "turnir3",
  },
    {
    id: "tp21",
    participantId: "participant8",
    tournamentId: "turnir3",
  },
]

//================= GROUP ==================
export const groups = [
  //турнир 1
  {
    id: "group1",
    name: "Группа A",
    tournamentId: "turnir1",
  },
  //турнир 2,
  {
    id: "group2",
    name: "Группа A",
    tournamentId: "turnir2",
  },
  {
    id: "group3",
    name: "Группа B",
    tournamentId: "turnir2",
  },
  //турнир 3
  {
    id: "group4",
    name: "Группа A",
    tournamentId: "turnir3",
  },
  {
    id: "group5",
    name: "Группа B",
    tournamentId: "turnir3",
  },
  {
    id: "group6",
    name: "Группа C",
    tournamentId: "turnir3",
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