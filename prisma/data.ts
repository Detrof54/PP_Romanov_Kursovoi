import { RaceType, Role } from "@prisma/client";

//Таблица User 
export const users = [
    {
        id: "user1",
        firstname: "Польх",
        surname: "Польх",
        email: "user1@err.com",
        role: Role.USER,
    },
    {
        id: "user2",
        firstname: "Польхвв",
        surname: "Польхвв",
        email: "user1@example.com",
        role: Role.USER,
    },
]

//Таблица User (админы)
export const admins = [
    {
        id: "user-admin",
        firstname: "Админ",
        surname: "Системный",
        email: "adminis@err.com",
        role: Role.ADMIN,
        judge: { id: "user-admin" },
    },
    {
        id: "user-admin2",
        firstname: "Админ2",
        surname: "Системный2",
        email: "admin2@example.com",
        role: Role.ADMIN,
        judge: { id: "user-admin2" },
    },
]

//Таблица User + Pilot (пилоты)
export const pilotUsers = [
    {
      id: "user-pilot1",
      firstname: "Иван",
      surname: "Пилотов",
      email: "pilot1@example.com",
      pilot: {
        id: "pilot1",
        birthDate: new Date("1995-01-01"),
        license: "LIC12345",
        start_number: 1,
      },
    },
    {
      id: "user-pilot2",
      firstname: "Петр",
      surname: "Гонщиков",
      email: "pilot2@example.com",
      pilot: {
        id: "pilot2",
        birthDate: new Date("1996-02-02"),
        license: "LIC67890",
        start_number: 2,
      },
    },
    {
    id: "user-pilot3",
    firstname: "Алексей",
    surname: "Скоростной",
    email: "pilot3@example.com",
    pilot: {
      id: "pilot3",
      birthDate: new Date("1994-03-15"),
      license: "LIC11111",
      start_number: 3,
    },
  },
  {
    id: "user-pilot4",
    firstname: "Дмитрий",
    surname: "Обгоняев",
    email: "pilot4@example.com",
    pilot: {
      id: "pilot4",
      birthDate: new Date("1993-04-20"),
      license: "LIC22222",
      start_number: 4,
    },
  },
  {
    id: "user-pilot5",
    firstname: "Сергей",
    surname: "Быстров",
    email: "pilot5@example.com",
    pilot: {
      id: "pilot5",
      birthDate: new Date("1992-05-05"),
      license: "LIC33333",
      start_number: 5,
    },
  },
  {
    id: "user-pilot6",
    firstname: "Антон",
    surname: "Тормозов",
    email: "pilot6@example.com",
    pilot: {
      id: "pilot6",
      birthDate: new Date("1997-06-10"),
      license: "LIC44444",
      start_number: 6,
    },
  },
  {
    id: "user-pilot7",
    firstname: "Максим",
    surname: "Шумахеров",
    email: "pilot7@example.com",
    pilot: {
      id: "pilot7",
      birthDate: new Date("1991-07-07"),
      license: "LIC55555",
      start_number: 7,
    },
  },
  {
    id: "user-pilot8",
    firstname: "Андрей",
    surname: "Финишов",
    email: "pilot8@example.com",
    pilot: {
      id: "pilot8",
      birthDate: new Date("1998-08-08"),
      license: "LIC66666",
      start_number: 8,
    },
  },
  {
    id: "user-pilot9",
    firstname: "Николай",
    surname: "Стартов",
    email: "pilot9@example.com",
    pilot: {
      id: "pilot9",
      birthDate: new Date("1990-09-09"),
      license: "LIC77777",
      start_number: 9,
    },
  },
  {
    id: "user-pilot10",
    firstname: "Егор",
    surname: "Трассов",
    email: "pilot10@example.com",
    pilot: {
      id: "pilot10",
      birthDate: new Date("1989-10-10"),
      license: "LIC88888",
      start_number: 10,
    },
  },
]

//Таблица User + Judge (судьи)
export const judgeUsers = [
    {
      id: "user-judge1",
      firstname: "Сергей",
      surname: "Судейкин",
      email: "judge12323@example.com",
      judge: { id: "judge1" },
    },
        {
      id: "user-judge2",
      firstname: "Сергей",
      surname: "Судейкин",
      email: "judge1tt@example.com",
      judge: { id: "judge2" },
    },
        {
      id: "user-judge3",
      firstname: "Сергей",
      surname: "Судейкин",
      email: "judge1rr@example.com",
      judge: { id: "judge3" },
    },
        {
      id: "user-judge4",
      firstname: "Сергей",
      surname: "Судейкин",
      email: "judge1ff@example.com",
      judge: { id: "judge4" },
    },
        {
      id: "user-judge5",
      firstname: "Сергей",
      surname: "Судейкин",
      email: "judge1sfdd@example.com",
      judge: { id: "judge5" },
    },
        {
      id: "user-judge6",
      firstname: "Сергей",
      surname: "Судейкин",
      email: "judge1sf@example.com",
      judge: { id: "judge6" },
    },
        {
      id: "user-judge7",
      firstname: "Сергей",
      surname: "Судейкин",
      email: "judgedsg@example.com",
      judge: { id: "judge7" },
    },
        {
      id: "user-judge8",
      firstname: "Сергей",
      surname: "Судейкин",
      email: "judge12@example.com",
      judge: { id: "judge8" },
    },

]


//Таблица Seson (Сезоны)
export const seasons = [
  {
    id: "season-2024",
    year: 2024, 
    isActive: false
  },
  {
    id: "season-2025",
    year: 2025, 
    isActive: true
  },
    {
    id: "season-2026",
    year: 2026, 
    isActive: false
  },
]

//--------Таблица Weekends--------------
//Викенды для сезона 2024
export const weekends2024 = [
    {
      id: "weekend-1-2024",
      stage: 1,
      nameTrassa: "MegaRacer",
      city: "Самара",
      dateStart: new Date("2024-08-29T14:30:00Z"),
      dateEnd: new Date("2024-08-31T14:30:00Z"),
    },
    {
      id: "weekend-2-2024",
      stage: 2,
      nameTrassa: "Новосибирск GP",
      city: "Новосибирск",
      dateStart: new Date("2024-09-05T14:30:00Z"),
      dateEnd: new Date("2024-09-07T14:30:00Z"),
    },
        {
      id: "weekend-3-2024",
      stage: 3,
      nameTrassa: "Рязань Recing",
      city: "Рязань",
      dateStart: new Date("2024-09-12T14:30:00Z"),
      dateEnd: new Date("2024-09-14T14:30:00Z"),
    },
    {
      id: "weekend-4-2024",
      stage: 4,
      nameTrassa: "АвтоКорс",
      city: "Красноярск",
      dateStart: new Date("2024-11-19T14:30:00Z"),
      dateEnd: new Date("2024-11-21T14:30:00Z"),
    },
];

//Викенды для сезона 2025
export const weekends2025 = [
  {
    id: "weekend-1-2025",
    stage: 1,
    nameTrassa: "MegaRacer",
    city: "Самара",
    dateStart: new Date("2025-08-29T14:30:00Z"),
    dateEnd: new Date("2025-08-31T14:30:00Z"),
  },
  {
    id: "weekend-2-2025",
    stage: 2,
    nameTrassa: "Новосибирск GP",
    city: "Новосибирск",
    dateStart: new Date("2025-09-05T14:30:00Z"),
    dateEnd: new Date("2025-09-07T14:30:00Z"),
  },
      {
    id: "weekend-3-2025",
    stage: 3,
    nameTrassa: "Рязань Recing",
    city: "Рязань",
    dateStart: new Date("2025-09-12T14:30:00Z"),
    dateEnd: new Date("2025-09-14T14:30:00Z"),
  },
  {
    id: "weekend-4-2025",
    stage: 4,
    nameTrassa: "АвтоКорс",
    city: "Красноярск",
    dateStart: new Date("2025-11-19T14:30:00Z"),
    dateEnd: new Date("2025-11-21T14:30:00Z"),
  },
];

//Викенды для сезона 2026
export const weekends2026 = [
  {
    id: "weekend-1-2026",
    stage: 1,
    nameTrassa: "MegaRacer",
    city: "Самара",
    dateStart: new Date("2026-08-29T14:30:00Z"),
    dateEnd: new Date("2026-08-31T14:30:00Z"),
  },
  {
    id: "weekend-2-2026",
    stage: 2,
    nameTrassa: "Новосибирск GP",
    city: "Новосибирск",
    dateStart: new Date("2026-09-05T14:30:00Z"),
    dateEnd: new Date("2026-09-07T14:30:00Z"),
  },
      {
    id: "weekend-3-2026",
    stage: 3,
    nameTrassa: "Рязань Recing",
    city: "Рязань",
    dateStart: new Date("2026-09-12T14:30:00Z"),
    dateEnd: new Date("2026-09-14T14:30:00Z"),
  },
  {
    id: "weekend-4-2026",
    stage: 4,
    nameTrassa: "АвтоКорс",
    city: "Красноярск",
    dateStart: new Date("2026-11-19T14:30:00Z"),
    dateEnd: new Date("2026-11-21T14:30:00Z"),
  },
];

export const pilots = [
  { id: "pilot1" },
  { id: "pilot2" },
  { id: "pilot3" },
  { id: "pilot4" },
  { id: "pilot5" },
  { id: "pilot6" },
  { id: "pilot7" },
  { id: "pilot8" },
  { id: "pilot9" },
  { id: "pilot10" },
]
//----------------------

//--------Таблица Evenst--------------
//Эвенты для сезона 2024
export const events2024 = [
  {
    id: "event-1-1-2024",
    type: RaceType.TEST_RACE,
    date: new Date("2024-08-29T14:30:00Z"),
    weekendId: "weekend-1-2024",
  },
  {
    id: "event-1-2-2024",
    type: RaceType.QUALIFICATION,
    date: new Date("2024-08-30T14:30:00Z"),
    weekendId: "weekend-1-2024",
  },
  {
    id: "event-1-3-2024",
    type: RaceType.RACE,
    date: new Date("2024-08-31T14:30:00Z"),
    weekendId: "weekend-1-2024",
  },
  {
    id: "event-2-1-2024",
    type: RaceType.TEST_RACE,
    date: new Date("2024-09-05T14:30:00Z"),
    weekendId: "weekend-2-2024",
  },
  {
    id: "event-2-2-2024",
    type: RaceType.QUALIFICATION,
    date: new Date("2024-09-06T14:30:00Z"),
    weekendId: "weekend-2-2024",
  },
  {
    id: "event-2-3-2024",
    type: RaceType.RACE,
    date: new Date("2024-09-07T14:30:00Z"),
    weekendId: "weekend-2-2024",
  },
  {
    id: "event-3-1-2024",
    type: RaceType.TEST_RACE,
    date: new Date("2024-09-12T14:30:00Z"),
    weekendId: "weekend-3-2024",
  },
  {
    id: "event-3-2-2024",
    type: RaceType.QUALIFICATION,
    date: new Date("2024-09-13T14:30:00Z"),
    weekendId: "weekend-3-2024",
  },
  {
    id: "event-3-3-2024",
    type: RaceType.RACE,
    date: new Date("2024-09-14T14:30:00Z"),
    weekendId: "weekend-3-2024",
  },
  {
    id: "event-4-1-2024",
    type: RaceType.TEST_RACE,
    date: new Date("2024-11-19T14:30:00Z"),
    weekendId: "weekend-4-2024",
  },
  {
    id: "event-4-2-2024",
    type: RaceType.QUALIFICATION,
    date: new Date("2024-11-20T14:30:00Z"),
    weekendId: "weekend-4-2024",
  },
  {
    id: "event-4-3-2024",
    type: RaceType.RACE,
    date: new Date("2024-11-21T14:30:00Z"),
    weekendId: "weekend-4-2024",
  },
];

//Эвенты для сезона 2025
export const events2025 = [
  {
    id: "event-1-1-2025",
    type: RaceType.TEST_RACE,
    date: new Date("2025-08-29T14:30:00Z"),
    weekendId: "weekend-1-2025",
  },
  {
    id: "event-1-2-2025",
    type: RaceType.QUALIFICATION,
    date: new Date("2025-08-30T14:30:00Z"),
    weekendId: "weekend-1-2025",
  },
  {
    id: "event-1-3-2025",
    type: RaceType.RACE,
    date: new Date("2025-08-31T14:30:00Z"),
    weekendId: "weekend-1-2025",
  },

  {
    id: "event-2-1-2025",
    type: RaceType.TEST_RACE,
    date: new Date("2025-09-05T14:30:00Z"),
    weekendId: "weekend-2-2025",
  },
  {
    id: "event-2-2-2025",
    type: RaceType.QUALIFICATION,
    date: new Date("2025-09-06T14:30:00Z"),
    weekendId: "weekend-2-2025",
  },
  {
    id: "event-2-3-2025",
    type: RaceType.RACE,
    date: new Date("2025-09-07T14:30:00Z"),
    weekendId: "weekend-2-2025",
  },

      {
    id: "event-3-1-2025",
    type: RaceType.TEST_RACE,
    date: new Date("2025-09-12T14:30:00Z"),
    weekendId: "weekend-3-2025",
  },
  {
    id: "event-3-2-2025",
    type: RaceType.QUALIFICATION,
    date: new Date("2025-09-13T14:30:00Z"),
    weekendId: "weekend-3-2025",
  },
  {
    id: "event-3-3-2025",
    type: RaceType.RACE,
    date: new Date("2025-09-14T14:30:00Z"),
    weekendId: "weekend-3-2025",
  },
  {
    id: "event-4-1-2025",
    type: RaceType.TEST_RACE,
    date: new Date("2025-11-19T14:30:00Z"),
    weekendId: "weekend-4-2025",
  },
  {
    id: "event-4-2-2025",
    type: RaceType.QUALIFICATION,
    date: new Date("2025-11-20T14:30:00Z"),
    weekendId: "weekend-4-2025",
  },
  {
    id: "event-4-3-2025",
    type: RaceType.RACE,
    date: new Date("2025-11-21T14:30:00Z"),
    weekendId: "weekend-4-2025",
  },
];

//Эвенты для сезона 2026
export const events2026 = [
  {
    id: "event-1-1-2026",
    type: RaceType.TEST_RACE,
    date: new Date("2026-08-29T14:30:00Z"),
    weekendId: "weekend-1-2026",
  },
  {
    id: "event-1-2-2026",
    type: RaceType.QUALIFICATION,
    date: new Date("2026-08-30T14:30:00Z"),
    weekendId: "weekend-1-2026",
  },
  {
    id: "event-1-3-2026",
    type: RaceType.RACE,
    date: new Date("2026-08-31T14:30:00Z"),
    weekendId: "weekend-1-2026",
  },
  {
    id: "event-2-1-2026",
    type: RaceType.TEST_RACE,
    date: new Date("2026-09-05T14:30:00Z"),
    weekendId: "weekend-2-2026",
  },
  {
    id: "event-2-2-2026",
    type: RaceType.QUALIFICATION,
    date: new Date("2026-09-06T14:30:00Z"),
    weekendId: "weekend-2-2026",
  },
  {
    id: "event-2-3-2026",
    type: RaceType.RACE,
    date: new Date("2026-09-07T14:30:00Z"),
    weekendId: "weekend-2-2026",
  },
  {
    id: "event-3-1-2026",
    type: RaceType.TEST_RACE,
    date: new Date("2026-09-12T14:30:00Z"),
    weekendId: "weekend-3-2026",
  },
  {
    id: "event-3-2-2026",
    type: RaceType.QUALIFICATION,
    date: new Date("2026-09-13T14:30:00Z"),
    weekendId: "weekend-3-2026",
  },
  {
    id: "event-3-3-2026",
    type: RaceType.RACE,
    date: new Date("2026-09-14T14:30:00Z"),
    weekendId: "weekend-3-2026",
  },
  {
    id: "event-4-1-2026",
    type: RaceType.TEST_RACE,
    date: new Date("2026-11-19T14:30:00Z"),
    weekendId: "weekend-4-2026",
  },
  {
    id: "event-4-2-2026",
    type: RaceType.QUALIFICATION,
    date: new Date("2026-11-20T14:30:00Z"),
    weekendId: "weekend-4-2026",
  },
  {
    id: "event-4-3-2026",
    type: RaceType.RACE,
    date: new Date("2026-11-21T14:30:00Z"),
    weekendId: "weekend-4-2026",
  },
];
//----------------------

//--------Таблица Result--------------
export const results = [
  //викенда 1, 25 года
  //ТЕСТОВЫЕ ЗАЕЗДЫ
  {
    id: "result-event-1-1-2025-p1",
    pilotId: "pilot1",
    eventId: "event-1-1-2025",
    pozition: 1,
    totalTime: 23000,       
    points: 0,
    bestLap: 23000,
  },
  {
    id: "result-event-1-1-2025-p2",
    pilotId: "pilot2",
    eventId: "event-1-1-2025",
    pozition: 2,
    totalTime: 23400,       
    points: 0,
    bestLap: 23400,
  },
  {
    id: "result-event-1-1-2025-p3",
    pilotId: "pilot3",
    eventId: "event-1-1-2025",
    pozition: 3,
    totalTime: 23900,       
    points: 0,
    bestLap: 23900,
  },
  {
    id: "result-event-1-1-2025-p4",
    pilotId: "pilot4",
    eventId: "event-1-1-2025",
    pozition: 4,
    totalTime: 25400,       
    points: 0,
    bestLap: 25400,
  },
  {
    id: "result-event-1-1-2025-p5",
    pilotId: "pilot5",
    eventId: "event-1-1-2025",
    pozition: 5,
    totalTime: 25500,       
    points: 0,
    bestLap: 25500,
  },
  {
    id: "result-event-1-1-2025-p6",
    pilotId: "pilot6",
    eventId: "event-1-1-2025",
    pozition: 6,
    totalTime: 25529,       
    points: 0,
    bestLap: 25529,
  },
  {
    id: "result-event-1-1-2025-p7",
    pilotId: "pilot7",
    eventId: "event-1-1-2025",
    pozition: 7,
    totalTime: 25600,       
    points: 0,
    bestLap: 25600,
  },
  {
    id: "result-event-1-1-2025-p8",
    pilotId: "pilot8",
    eventId: "event-1-1-2025",
    pozition: 8,
    totalTime: 25620,       
    points: 0,
    bestLap: 25620,
  },
    {
    id: "result-event-1-1-2025-p9",
    pilotId: "pilot9",
    eventId: "event-1-1-2025",
    pozition: 9,
    totalTime: 25630,       
    points: 0,
    bestLap: 25630,
  },
  {
    id: "result-event-1-1-2025-p10",
    pilotId: "pilot10",
    eventId: "event-1-1-2025",
    pozition: 10,
    totalTime: 25720,       
    points: 0,
    bestLap: 25720,
  },


  //КВАЛИФИКАЦИЯ
  {
    id: "result-event-1-2-2025-p1",
    pilotId: "pilot1",
    eventId: "event-1-2-2025",
    pozition: 1,
    totalTime: 23000,       
    points: 0,
    bestLap: 23000,
  },
  {
    id: "result-event-1-2-2025-p2",
    pilotId: "pilot2",
    eventId: "event-1-2-2025",
    pozition: 2,
    totalTime: 23400,       
    points: 0,
    bestLap: 23400,
  },
  {
    id: "result-event-1-2-2025-p3",
    pilotId: "pilot3",
    eventId: "event-1-2-2025",
    pozition: 3,
    totalTime: 23900,       
    points: 0,
    bestLap: 23900,
  },
  {
    id: "result-event-1-2-2025-p4",
    pilotId: "pilot4",
    eventId: "event-1-2-2025",
    pozition: 4,
    totalTime: 25400,       
    points: 0,
    bestLap: 25400,
  },
  {
    id: "result-event-1-2-2025-p5",
    pilotId: "pilot5",
    eventId: "event-1-2-2025",
    pozition: 5,
    totalTime: 25500,       
    points: 0,
    bestLap: 25500,
  },
  {
    id: "result-event-1-2-2025-p6",
    pilotId: "pilot6",
    eventId: "event-1-2-2025",
    pozition: 6,
    totalTime: 25529,       
    points: 0,
    bestLap: 25529,
  },
  {
    id: "result-event-1-2-2025-p7",
    pilotId: "pilot7",
    eventId: "event-1-2-2025",
    pozition: 7,
    totalTime: 25600,       
    points: 0,
    bestLap: 25600,
  },
  {
    id: "result-event-1-2-2025-p8",
    pilotId: "pilot8",
    eventId: "event-1-2-2025",
    pozition: 8,
    totalTime: 25620,       
    points: 0,
    bestLap: 25620,
  },
  {
    id: "result-event-1-2-2025-p9",
    pilotId: "pilot9",
    eventId: "event-1-2-2025",
    pozition: 9,
    totalTime: 25630,       
    points: 0,
    bestLap: 25630,
  },
  {
    id: "result-event-1-2-2025-p10",
    pilotId: "pilot10",
    eventId: "event-1-2-2025",
    pozition: 10,
    totalTime: 25720,       
    points: 0,
    bestLap: 25720,
  },

  //ГОНКА
  {
    id: "result-event-1-3-2025-p1",
    pilotId: "pilot1",
    eventId: "event-1-3-2025",
    pozition: 1,
    totalTime: 349950,       
    points: 25,
    bestLap: 23330,
  },
  {
    id: "result-event-1-3-2025-p2",
    pilotId: "pilot2",
    eventId: "event-1-3-2025",
    pozition: 2,
    totalTime: 350000,       
    points: 18,
    bestLap: 23400,
  },
  {
    id: "result-event-1-3-2025-p3",
    pilotId: "pilot3",
    eventId: "event-1-3-2025",
    pozition: 3,
    totalTime: 350100,       
    points: 15,
    bestLap: 23900,
  },
  {
    id: "result-event-1-3-2025-p4",
    pilotId: "pilot4",
    eventId: "event-1-3-2025",
    pozition: 4,
    totalTime: 350200,       
    points: 12,
    bestLap: 25400,
  },
  {
    id: "result-event-1-3-2025-p5",
    pilotId: "pilot5",
    eventId: "event-1-3-2025",
    pozition: 5,
    totalTime: 350300,       
    points: 10,
    bestLap: 25500,
  },
  {
    id: "result-event-1-3-2025-p6",
    pilotId: "pilot6",
    eventId: "event-1-3-2025",
    pozition: 6,
    totalTime: 350420,       
    points: 8,
    bestLap: 25529,
  },
  {
    id: "result-event-1-3-2025-p7",
    pilotId: "pilot7",
    eventId: "event-1-3-2025",
    pozition: 7,
    totalTime: 360000,       
    points: 6,
    bestLap: 25600,
  },
  {
    id: "result-event-1-3-2025-p8",
    pilotId: "pilot8",
    eventId: "event-1-3-2025",
    pozition: 8,
    totalTime: 361000,       
    points: 4,
    bestLap: 25620,
  },
  {
    id: "result-event-1-3-2025-p9",
    pilotId: "pilot9",
    eventId: "event-1-3-2025",
    pozition: 9,
    totalTime: 366000,       
    points: 2,
    bestLap: 25630,
  },
  {
    id: "result-event-1-3-2025-p10",
    pilotId: "pilot10",
    eventId: "event-1-3-2025",
    pozition: 10,
    totalTime: 377000,       
    points: 1,
    bestLap: 25720,
  },


]
//------------------------------------

//--------Таблица Penalty--------------
export const penalties = [
  {
    id: "penalty-1",
    reason: "Выдавливание с трассы",
    time: 1000,
    pilotId: "pilot2",
    judgeId: "judge1",
    eventId: "event-1-3-2025", 
  },
  {
    id: "penalty-2",
    reason: "Выезд за пределы трассы и получение преимущества",
    time: 2000, 
    pilotId: "pilot3",
    judgeId: "judge1",
    eventId: "event-2-3-2025",
  },
];
//------------------------------------