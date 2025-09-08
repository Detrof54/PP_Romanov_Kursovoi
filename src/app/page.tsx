import Link from "next/link";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import {Navbar} from "~/app/_components/navbar"
import {SigninLink} from "~/app/_components/signlink"
import CurrentWeekend from "./_components/main/CurrentWeekend";
import WeekendOverview from "./_components/main/RacingWeeks";
import News, { type NewsItem } from "./_components/main/news";
import { db } from "~/server/db";



// Заглушка
const newsData = [ 
  { id: "1", 
    title: "Новый этап SMP Karting 2025", 
    summary: "В этом сезоне пилоты поборются за победу на трассе Монца и Монако.", 
    date: "2025-09-01T12:00:00Z", 
    image: "/news1.webp", 
  }, 
  { 
    id: "2", 
    title: "Результаты квалификации", 
    summary: "Квалификация этапа в Спа прошла с рекордными показателями времени.", 
    date: "2025-08-30T18:00:00Z", 
    image: "/news2.webp", 
  }, 
  { 
    id: "3", 
    title: "Интервью с победителем гонки", 
    summary: "Пилот рассказал о подготовке и стратегии на предстоящий сезон.", 
    date: "2025-08-29T10:00:00Z", 
    image: "/news3.webp", 
  }, ];



export default async function Home() {
  //const session = await auth();
  //return <h1>Main page</h1>


  //tRPC роутеры PCN - previous, current, next
  const weekendPCN = await api.mainPageRouter.getWeekendOverview();

  const weekendPCNData = {
  previous: weekendPCN.previous
    ? {
        ...weekendPCN.previous,
        seasonYear: weekendPCN.previous.season.year,
        events: weekendPCN.previous.events.map((e) => ({
          type: e.type,
          data: e.data.toISOString(),
        })),
      }
    : undefined,
  current: weekendPCN.current
    ? {
        ...weekendPCN.current,
        seasonYear: weekendPCN.current.season.year,
        events: weekendPCN.current.events.map((e) => ({
          type: e.type,
          data: e.data.toISOString(),
        })),
      }
    : undefined,
  next: weekendPCN.next
    ? {
        ...weekendPCN.next,
        seasonYear: weekendPCN.next.season.year,
        events: weekendPCN.next.events.map((e) => ({
          type: e.type,
          data: e.data.toISOString(),
        })),
      }
    : undefined,
};


  return (
      <div className="!bg-gray-900 p-4 text-white">
        <CurrentWeekend weekendPCN={weekendPCNData} />
        <WeekendOverview weekendPCN={weekendPCNData} />
        <News news={newsData} />
      </div>
    )
  }
