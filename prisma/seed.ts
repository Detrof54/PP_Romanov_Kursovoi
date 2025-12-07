import { PrismaClient, Role, RaceType } from "@prisma/client";
import path from "path";
import fs from "fs";
import { admins, events2024, events2025, events2026, judgeUsers, 
  penalties, 
  pilots, pilotUsers, results, seasons, weekends2024, weekends2025, 
  weekends2026 } from "./data";


const prisma = new PrismaClient();

interface weekendsInterface {
  id: string,
  stage: number,
  nameTrassa: string,
  city: string,
  dateStart: Date,
  dateEnd: Date,
}
interface pilotsInterface {
  id:string
}

//Шаблон upsert викендов
async function upsertWeekend(season_id: string, weekends: weekendsInterface[], pilots:pilotsInterface[]){
  // Добавляем викенды ... года
  for (const weekend of weekends) {
    await prisma.weekend.upsert({
      where: { seasonId_stage: { seasonId: season_id, stage: weekend.stage } },
      update: {},
      create: {
        id: weekend.id,
        stage: weekend.stage,
        nameTrassa: weekend.nameTrassa,
        city: weekend.city,
        dateStart: weekend.dateStart,
        dateEnd: weekend.dateEnd,
        seasonId: season_id,
      },
    });
  }
  //добавление пилотов к ... сезону 
  await prisma.season.update({
    where: { id: season_id },
    data: {
      pilots: {
        connect: pilots,
      },
    },
  });
}

interface eventsInterface{
  id: string,
  type: RaceType,
  date: Date,
  weekendId: string,
}
//Шаблон upsert эвентов
async function upsertEvent(events: eventsInterface[]){
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
}

//удаление всех данных из БД
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

async function main() {
  // Удаляем данные
  await clearDb()

  console.log("🌱 Сидирование фиксированных данных...");

// =====  USER PILOT JUDGE =====
  // Добавление админов
    for (const admin of admins) {
    await prisma.user.upsert({
      where: { email: admin.email },
      update: {},
      create: {
        id: admin.id,
        firstname: admin.firstname,
        surname: admin.surname,
        email: admin.email,
        role: Role.ADMIN,
        emailVerified: new Date(),
        judge: {
          create: admin.judge,
        },
      },
      include: { judge: true },
      });
  }

  // Добавление пилотов
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
        emailVerified: new Date(),
        pilot: {
          create: user.pilot,
        },
      },
      include: { pilot: true },
    });
  }

  // Добавление судей
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
        emailVerified: new Date(),
        judge: {
          create: user.judge,
        },
      },
      include: { judge: true },
    });
  }
//================================

 
// ===== SEASON WEEKENDS =====
  // Создание сезонов
  for (const season of seasons) {
    await prisma.season.upsert({
      where: { id: season.id },
      update: {},
      create: { id: season.id, 
        year: season.year, 
        isActive: season.isActive 
      },
    })
  }

  // Добавляем викенды 2024 года
  const season2024_id = seasons[0]?.id || "season-2024"
  await upsertWeekend(season2024_id, weekends2024, pilots)

  // Добавляем викенды 2025 года
  const season2025_id = seasons[1]?.id || "season-2025"
  await upsertWeekend(season2025_id, weekends2025, pilots)

  // Добавляем викенды 2026 года
  const season2026_id = seasons[2]?.id || "season-2026"
  await upsertWeekend(season2026_id, weekends2026, pilots)
//================================


// ========== EVENTS ================
  // Добавляем викенды для 2024 года
  await upsertEvent(events2024)

  // Добавляем викенды для 2025 года
  await upsertEvent(events2025)

  // Добавляем викенды для 2026 года
  await upsertEvent(events2026)
//===================================

// =========== RESULT ====================
  for (const result of results) {
    await prisma.result.upsert({
      where: { id: result.id },
      update: {},
      create: {
        id: result.id,
        pilotId: result.pilotId,
        eventId: result.eventId,
        pozition: result.pozition,
        totalTime: result.totalTime,
        points: result.points,
        bestLap: result.bestLap,
      },
      include: {  },
    });
  }
//========================================


// ============== PENALTY =================

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