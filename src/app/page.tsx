import Link from "next/link";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import {Navbar} from "~/app/_components/navbar"
import {SigninLink} from "~/app/_components/signlink"
import CurrentWeekend from "./_components/main/CurrentWeekend";
import WeekendOverview from "./_components/main/RacingWeeks";
import News, { type NewsItem } from "./_components/main/news";
import { db } from "~/server/db";


export default async function Home() {
  //const session = await auth();
  //return <h1>Main page</h1>

  const weekendPCN = await api.mainPageRouter.getWeekendOverview();
  // const newsData = await api.mainPageRouter.getNewsData();

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
      <div className="min-h-screen w-full !bg-gray-900 p-4 text-white">
        <CurrentWeekend weekendPCN={weekendPCNData} />
        <WeekendOverview weekendPCN={weekendPCNData} />
        {/* <News news={newsData} /> */}
      </div>
    )
  }
