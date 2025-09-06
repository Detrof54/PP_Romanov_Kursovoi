import { PrismaClient, Role, RaceType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
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
      nameTrassa: "Silverstone",
      city: "London",
      dateStart: new Date("2025-03-10"),
      dateEnd: new Date("2025-11-12"),
    },
    {
      id: "weekend-2",
      stage: 2,
      nameTrassa: "Monaco GP",
      city: "Monaco",
      dateStart: new Date("2025-03-10"),
      dateEnd: new Date("2025-11-12"),
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
      id: "event-1",
      type: RaceType.RACE,
      date: new Date("2025-04-11"),
      weekendId: "weekend-1",
    },
    {
      id: "event-2",
      type: RaceType.QUALIFICATION,
      date: new Date("2025-05-02"),
      weekendId: "weekend-1",
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
    eventId: "event-1",
    position: 1,
    points: 25,
    bestLap: 1.32,
  },
  {
    id: "result-2",
    pilotId: "pilot2",
    eventId: "event-1",
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
      eventId: "event-1",
    },
    {
      id: "penalty-2",
      reason: "Нарушение правил старта",
      points: null,
      time: 10,
      disqualified: false,
      pilotId: "pilot2",
      judgeId: "judge1",
      eventId: "event-2",
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