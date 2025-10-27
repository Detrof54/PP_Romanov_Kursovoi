import { PrismaClient, Role, RaceType } from "@prisma/client";
import path from "path";
import fs from "fs";


const prisma = new PrismaClient();

async function clearDb() {
  console.log("Удаляем старые данные...");

  // Сначала самые зависимые таблицы
  await prisma.penalty.deleteMany({});
  await prisma.result.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.weekend.deleteMany({});
  // await prisma.news.deleteMany({});

  // Потом родительские таблицы
  await prisma.season.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.pilot.deleteMany({});
  await prisma.judge.deleteMany({});

  console.log("База очищена");
}

// Функция для расчета очков по системе F1
function calculatePoints(position: number): number {
  const pointsSystem = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
  return pointsSystem[position - 1] ?? 0;
}

// Функция для генерации случайного времени в миллисекундах
function generateRaceTime(baseTime: number, variation: number = 10000): number {
  return baseTime + Math.floor(Math.random() * variation);
}

// Функция для генерации времени лучшего круга
function generateBestLap(baseLap: number, variation: number = 2000): number {
  return baseLap + Math.random() * variation;
}

async function main() {
  // Удаляем данные
  await clearDb()

  console.log("🌱 Сидирование фиксированных данных...");

  // ===== USERS =====
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      id: "user-admin",
      firstname: "Админ",
      surname: "Системный",
      email: "admin@example.com",
      role: Role.ADMIN,
    },
  });

  const pilotUsers = [
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
  ];

  const judgeUsers = [
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

  ];

  // Upsert пилотов
  for (const user of pilotUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: user.id,
        firstname: user.firstname,
        surname: user.surname,
        email: user.email,
        role: Role.PILOT,
        pilot: {
          create: user.pilot,
        },
      },
      include: { pilot: true },
    });
  }

  // Upsert судей
  for (const user of judgeUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: user.id,
        firstname: user.firstname,
        surname: user.surname,
        email: user.email,
        role: Role.JUDGE,
        judge: {
          create: user.judge,
        },
      },
      include: { judge: true },
    });
  }

  
  // ===== SEASON & WEEKENDS =====
  const season2024 = await prisma.season.upsert({
    where: { id: "season-2024" },
    update: {},
    create: { id: "season-2024", year: 2024, isActive: false },
  });

  const weekends2024 = [
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

  for (const weekend of weekends2024) {
    await prisma.weekend.upsert({
      where: { seasonId_stage: { seasonId: season2024.id, stage: weekend.stage } },
      update: {},
      create: {
        id: weekend.id,
        stage: weekend.stage,
        nameTrassa: weekend.nameTrassa,
        city: weekend.city,
        dateStart: weekend.dateStart,
        dateEnd: weekend.dateEnd,
        seasonId: season2024.id,
      },
    });
  }

  await prisma.season.update({
  where: { id: season2024.id },
  data: {
    pilots: {
      connect: [
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
      ],
    },
  },
});

    const season2025 = await prisma.season.upsert({
    where: { id: "season-2025" },
    update: {},
    create: { id: "season-2025", year: 2025, isActive: true },
    });

  const weekends2025 = [
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

  for (const weekend of weekends2025) {
    await prisma.weekend.upsert({
      where: { seasonId_stage: { seasonId: season2025.id, stage: weekend.stage } },
      update: {},
      create: {
        id: weekend.id,
        stage: weekend.stage,
        nameTrassa: weekend.nameTrassa,
        city: weekend.city,
        dateStart: weekend.dateStart,
        dateEnd: weekend.dateEnd,
        seasonId: season2025.id,
      },
    });
  }

  await prisma.season.update({
  where: { id: season2025.id },
  data: {
    pilots: {
      connect: [
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
      ],
    },
  },
});

  const season2026 = await prisma.season.upsert({
    where: { id: "season-2026" },
    update: {},
    create: { id: "season-2026", year: 2026, isActive: false },
  });

  const weekends2026 = [
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

  for (const weekend of weekends2026) {
    await prisma.weekend.upsert({
      where: { seasonId_stage: { seasonId: season2026.id, stage: weekend.stage } },
      update: {},
      create: {
        id: weekend.id,
        stage: weekend.stage,
        nameTrassa: weekend.nameTrassa,
        city: weekend.city,
        dateStart: weekend.dateStart,
        dateEnd: weekend.dateEnd,
        seasonId: season2026.id,
      },
    });
  }

  await prisma.season.update({
  where: { id: season2026.id },
  data: {
    pilots: {
      connect: [
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
      ],
    },
  },
});


  // ===== EVENTS =====

const events2024 = [
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


  for (const event of events2024) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: {},
      create: {
        id: event.id,
        type: event.type,
        data: event.date,
        weekendId: event.weekendId,
      },
    });
  }

  const events2025 = [
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


  for (const event of events2025) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: {},
      create: {
        id: event.id,
        type: event.type,
        data: event.date,
        weekendId: event.weekendId,
      },
    });
  }

  const events2026 = [
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


    for (const event of events2026) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: {},
      create: {
        id: event.id,
        type: event.type,
        data: event.date,
        weekendId: event.weekendId,
      },
    });
  }


  // ===== Результаты =====
const pilotsIds = pilotUsers.map(user => user.pilot.id);

  // Для каждого события создаем результаты
  for (const event of events2025) {
    const results = [];
    
    // Генерируем времена для всех пилотов
    for (const pilotId of pilotsIds) {
      let totalTime: number;
      let bestLap: number | null;
      let points: number = 0;

      if (event.type === RaceType.RACE) {
        // Для гонки - генерируем реальные времена
        totalTime = generateRaceTime(1800000); // 30 минут базовое время
        bestLap = generateBestLap(90000); // 1.5 минуты базовый круг
      } else if (event.type === RaceType.QUALIFICATION) {
        // Для квалификации - только лучшее время круга
        totalTime = 0;
        bestLap = generateBestLap(90000);
      } else {
        // Для тестовых заездов
        totalTime = generateRaceTime(600000); // 10 минут
        bestLap = generateBestLap(95000); // чуть медленнее
      }

      results.push({
        pilotId,
        totalTime,
        bestLap,
        points, // Пока 0, расчитаем после сортировки
      });
    }

    // Сортируем результаты в зависимости от типа события
    if (event.type === RaceType.RACE) {
      // Для гонки сортируем по totalTime
      results.sort((a, b) => a.totalTime - b.totalTime);
      
      // Назначаем очки по системе F1
      results.forEach((result, index) => {
        result.points = calculatePoints(index + 1);
      });
    } else if (event.type === RaceType.QUALIFICATION) {
      // Для квалификации сортируем по bestLap
      results.sort((a, b) => (a.bestLap || Infinity) - (b.bestLap || Infinity));
      // В квалификации очки не начисляются
    } else {
      // Для тестовых заездов сортируем по bestLap, очки не начисляются
      results.sort((a, b) => (a.bestLap || Infinity) - (b.bestLap || Infinity));
    }

    // Сохраняем результаты в БД
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (!result) continue; // Пропускаем если undefined
    
    await prisma.result.upsert({
      where: {
        pilotId_eventId: {
          pilotId: result.pilotId,
          eventId: event.id,
        },
      },
      update: {
        pozition: i + 1,
        totalTime: result.totalTime,
        bestLap: result.bestLap,
        points: result.points,
      },
      create: {
        pilotId: result.pilotId,
        eventId: event.id,
        pozition: i + 1,
        totalTime: result.totalTime,
        bestLap: result.bestLap,
        points: result.points,
      },
    });
  }
  }


  // ===== ШТРАФЫ =====
  const penalties = [
    {
      id: "penalty-1",
      reason: "Выдавливание с трассы",
      time: null,
      pilotId: "pilot1",
      judgeId: "judge1",
      eventId: "event-1-3-2025", // Штраф в гонке
    },
    {
      id: "penalty-2",
      reason: "Выезд за пределы трассы и получение преимущества",
      time: 5000, // +5 секунд к времени
      pilotId: "pilot2",
      judgeId: "judge1",
      eventId: "event-1-3-2025",
    },
    {
      id: "penalty-3",
      reason: "Опасное вождение",
      time: null,
      pilotId: "pilot3",
      judgeId: "judge1",
      eventId: "event-2-3-2025",
    },
    {
      id: "penalty-4",
      reason: "Фальстарт",
      time: 10000, // +10 секунд
      pilotId: "pilot4",
      judgeId: "judge1",
      eventId: "event-1-2-2025", // Штраф в квалификации
    },
  ];

  for (const penalty of penalties) {
    await prisma.penalty.upsert({
      where: { id: penalty.id },
      update: {},
      create: {
        id: penalty.id,
        reason: penalty.reason,
        time: penalty.time,
        pilot: { connect: { id: penalty.pilotId } },
        judge: { connect: { id: penalty.judgeId } },
        event: { connect: { id: penalty.eventId } },
      },
    });

    // Если штраф применяется ко времени, обновляем результат
    if (penalty.time && penalty.time > 0) {
      const existingResult = await prisma.result.findUnique({
        where: {
          pilotId_eventId: {
            pilotId: penalty.pilotId,
            eventId: penalty.eventId,
          },
        },
      });

      if (existingResult) {
        await prisma.result.update({
          where: {
            pilotId_eventId: {
              pilotId: penalty.pilotId,
              eventId: penalty.eventId,
            },
          },
          data: {
            totalTime: existingResult.totalTime + penalty.time,
          },
        });
      }
    }
    
  }

  //Новости
//   const newsData = [
//   {
//     id: "1",
//     title: "Новый этап SMP Karting 2025",
//     summary:
//       "В этом сезоне пилоты поборются за победу на трассе Монца и Монако.",
//     date: "2025-10-12T12:00:00Z",
//     image: "/news1.webp",
//   },
//   {
//     id: "2",
//     title: "Результаты квалификации",
//     summary:
//       "Квалификация этапа в Спа прошла с рекордными показателями времени.",
//     date: "2025-10-12T18:00:00Z",
//     image: "/news2.webp",
//   },
//   {
//     id: "3",
//     title: "Интервью с победителем гонки",
//     summary:
//       "Пилот рассказал о подготовке и стратегии на предстоящий сезон.",
//     date: "2025-10-12T10:00:00Z",
//     image: "/news3.webp",
//   },
// ]; 
//   for (const news of newsData) {
//     // Путь к файлу в папке /public
//     const filePath = path.join(process.cwd(), "public", news.image);
//     let imageBuffer: Buffer | undefined;

//     try {
//       imageBuffer = fs.readFileSync(filePath);
//     } catch (err) {
//       console.warn(`⚠️  Не удалось прочитать файл ${filePath}. Пропускаю image.`);
//     }

//     await prisma.news.upsert({
//       where: { id: news.id },
//       update: {}, // можно указать поля для обновления, если нужно
//       create: {
//         id: news.id,
//         title: news.title,
//         summary: news.summary,
//         date: new Date(news.date),
//         image: imageBuffer,
//       },
//     });
//   }




  console.log("✅ Сидирование завершено. Все данные фиксированные.");
}





main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });