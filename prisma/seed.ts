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
    const season = await prisma.season.upsert({
    where: { id: "season-2025" },
    update: {},
    create: { id: "season-2025", year: 2025, isActive: true },
    });

  const weekends = [
    {
      id: "weekend-1",
      stage: 1,
      nameTrassa: "MegaRacer",
      city: "Самара",
      dateStart: new Date("2025-08-29T14:30:00Z"),
      dateEnd: new Date("2025-08-31T14:30:00Z"),
    },
    {
      id: "weekend-2",
      stage: 2,
      nameTrassa: "Новосибирск GP",
      city: "Новосибирск",
      dateStart: new Date("2025-09-05T14:30:00Z"),
      dateEnd: new Date("2025-09-07T14:30:00Z"),
    },
        {
      id: "weekend-3",
      stage: 3,
      nameTrassa: "Рязань Recing",
      city: "Рязань",
      dateStart: new Date("2025-09-12T14:30:00Z"),
      dateEnd: new Date("2025-09-14T14:30:00Z"),
    },
    {
      id: "weekend-4",
      stage: 4,
      nameTrassa: "АвтоКорс",
      city: "Красноярск",
      dateStart: new Date("2025-11-19T14:30:00Z"),
      dateEnd: new Date("2025-11-21T14:30:00Z"),
    },
  ];

  for (const weekend of weekends) {
    await prisma.weekend.upsert({
      where: { seasonId_stage: { seasonId: season.id, stage: weekend.stage } },
      update: {},
      create: {
        id: weekend.id,
        stage: weekend.stage,
        nameTrassa: weekend.nameTrassa,
        city: weekend.city,
        dateStart: weekend.dateStart,
        dateEnd: weekend.dateEnd,
        seasonId: season.id,
      },
    });
  }

  // ===== EVENTS =====
  const events = [
    {
      id: "event-1-1",
      type: RaceType.TEST_RACE,
      date: new Date("2025-08-29T14:30:00Z"),
      weekendId: "weekend-1",
    },
    {
      id: "event-1-2",
      type: RaceType.QUALIFICATION,
      date: new Date("2025-08-30T14:30:00Z"),
      weekendId: "weekend-1",
    },
    {
      id: "event-1-3",
      type: RaceType.RACE,
      date: new Date("2025-08-31T14:30:00Z"),
      weekendId: "weekend-1",
    },

    {
      id: "event-2-1",
      type: RaceType.TEST_RACE,
      date: new Date("2025-09-05T14:30:00Z"),
      weekendId: "weekend-2",
    },
    {
      id: "event-2-2",
      type: RaceType.QUALIFICATION,
      date: new Date("2025-09-06T14:30:00Z"),
      weekendId: "weekend-2",
    },
    {
      id: "event-2-3",
      type: RaceType.RACE,
      date: new Date("2025-09-07T14:30:00Z"),
      weekendId: "weekend-2",
    },

        {
      id: "event-3-1",
      type: RaceType.TEST_RACE,
      date: new Date("2025-09-12T14:30:00Z"),
      weekendId: "weekend-3",
    },
    {
      id: "event-3-2",
      type: RaceType.QUALIFICATION,
      date: new Date("2025-09-13T14:30:00Z"),
      weekendId: "weekend-3",
    },
    {
      id: "event-3-3",
      type: RaceType.RACE,
      date: new Date("2025-09-14T14:30:00Z"),
      weekendId: "weekend-3",
    },
    {
      id: "event-4-1",
      type: RaceType.TEST_RACE,
      date: new Date("2025-11-19T14:30:00Z"),
      weekendId: "weekend-4",
    },
    {
      id: "event-4-2",
      type: RaceType.QUALIFICATION,
      date: new Date("2025-11-20T14:30:00Z"),
      weekendId: "weekend-4",
    },
    {
      id: "event-4-3",
      type: RaceType.RACE,
      date: new Date("2025-11-21T14:30:00Z"),
      weekendId: "weekend-4",
    },
  ];


  for (const event of events) {
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
 const results = [
  {
    id: "result-1",
    pilotId: "pilot1",
    eventId: "event-1-2",
    position: 1,
    points: 25,
    bestLap: 1.32,
  },
  {
    id: "result-2",
    pilotId: "pilot2",
    eventId: "event-1-1",
    position: 2,
    points: 18,
    bestLap: 1.35,
  },
];

    for (const r of results) {
        await prisma.result.upsert({
        where: { pilotId_eventId: { pilotId: r.pilotId, eventId: r.eventId } },
        update: {},
        create: {
            pilotId: r.pilotId,
            eventId: r.eventId,
            position: r.position,
            points: r.points,
            bestLap: r.bestLap,
        },
        });
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
      eventId: "event-1-1",
    },
    {
      id: "penalty-2",
      reason: "Нарушение правил старта",
      points: null,
      time: 10,
      disqualified: false,
      pilotId: "pilot2",
      judgeId: "judge1",
      eventId: "event-2-2",
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