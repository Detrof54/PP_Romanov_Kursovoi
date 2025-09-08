import { PrismaClient, Role, RaceType } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDb() {
  console.log("Удаляем старые данные...");

  // Сначала самые зависимые таблицы
  await prisma.penalty.deleteMany({});
  await prisma.result.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.weekend.deleteMany({});

  // Потом родительские таблицы
  await prisma.season.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.pilot.deleteMany({});
  await prisma.judge.deleteMany({});

  console.log("База очищена");
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
      email: "judge1@example.com",
      judge: { id: "judge1" },
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


  // ===== RESULTS =====
const pilotsIds = [
  "pilot1","pilot2","pilot3","pilot4","pilot5",
  "pilot6","pilot7","pilot8","pilot9","pilot10"
];

const allEvents = [...events2024, ...events2025, ...events2026];
const raceEvents = allEvents.filter(e => e.type === RaceType.RACE);

for (let eIdx = 0; eIdx < raceEvents.length; eIdx++) {
  const event = raceEvents[eIdx];
  if (!event) continue;

  for (let pIdx = 0; pIdx < pilotsIds.length; pIdx++) {
    const pilotId = pilotsIds[pIdx]!;

    const position = (pIdx + eIdx) % pilotsIds.length + 1;
    const points = Math.max(0, 25 - (position - 1) * 2);
    const bestLap = +(1 + pIdx * 0.01 + eIdx * 0.01).toFixed(2);

    await prisma.result.upsert({
      where: {
        pilotId_eventId: {
          pilotId,
          eventId: event.id,
        },
      },
      update: {
        position,
        points,
        bestLap,
      },
      create: {
        pilotId,
        eventId: event.id,
        position,
        points,
        bestLap,
      },
    });
  }
}
  // ===== PENALTIES =====
  const penalties = [
    {
      id: "penalty-1",
      reason: "Превышение скорости в пит-лейн",
      points: 5,
      time: null,
      disqualified: false,
      pilotId: "pilot1",
      judgeId: "judge1",
      eventId: "event-1-1-2025",
    },
    {
      id: "penalty-2",
      reason: "Нарушение правил старта",
      points: null,
      time: 10,
      disqualified: false,
      pilotId: "pilot2",
      judgeId: "judge1",
      eventId: "event-2-2-2025",
    },
  ];

  for (const p of penalties) {
    await prisma.penalty.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        reason: p.reason,
        points: p.points,
        time: p.time,
        disqualified: p.disqualified,
        pilot: { connect: { id: p.pilotId } },
        judge: { connect: { id: p.judgeId } },
        event: { connect: { id: p.eventId } },
      },
    });
  }

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