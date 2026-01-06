import { api, HydrateClient } from "~/trpc/server";
import CurrentWeekend from "./_components/main/CurrentWeekend";
import WeekendOverview from "./_components/main/RacingWeeks";



export default async function Home() {
  //const session = await auth();

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
      </div>
    )
  }
