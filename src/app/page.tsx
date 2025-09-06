import Link from "next/link";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import {Navbar} from "~/app/_components/navbar"
import {SigninLink} from "~/app/_components/signlink"
import CurrentWeekend from "./_components/main/CurrentWeekend";
import WeekendOverview from "./_components/main/RacingWeeks";
import News from "./_components/main/news";
import { db } from "~/server/db";

export default async function Home() {
  //const session = await auth();
  //return <h1>Main page</h1>

//временное решение

    const previousWeekend:any = {
    id: "w1",
    city: "Спа",
    nameTrassa: "Circuit de Spa-Francorchamps",
    seasonYear: 2025,
    events: [
      { type: "TEST_RACE", data: "2025-08-30T12:00:00Z" },
      { type: "QUALIFICATION", data: "2025-08-30T16:00:00Z" },
      { type: "RACE", data: "2025-08-31T14:00:00Z" },
    ],
  };

  const currentWeekend:any = {
    id: "w2",
    city: "Монца",
    nameTrassa: "Autodromo Nazionale",
    seasonYear: 2025,
    events: [
      { type: "TEST_RACE", data: "2025-09-06T12:00:00Z" },
      { type: "QUALIFICATION", data: "2025-09-06T16:00:00Z" },
      { type: "RACE", data: "2025-09-07T14:00:00Z" },
    ],
  };

  const nextWeekend:any = {
    id: "w3",
    city: "Монако",
    nameTrassa: "Monte Carlo Circuit",
    seasonYear: 2025,
    events: [
      { type: "TEST_RACE", data: "2025-09-13T12:00:00Z" },
      { type: "QUALIFICATION", data: "2025-09-13T16:00:00Z" },
      { type: "RACE", data: "2025-09-14T14:00:00Z" },
    ],
  };
  const newsData = [
  {
    id: "1",
    title: "Новый этап SMP Karting 2025",
    summary: "В этом сезоне пилоты поборются за победу на трассе Монца и Монако.",
    date: "2025-09-01T12:00:00Z",
    image: "/images/news1.jpg",
  },
  {
    id: "2",
    title: "Результаты квалификации",
    summary: "Квалификация этапа в Спа прошла с рекордными показателями времени.",
    date: "2025-08-30T18:00:00Z",
    image: "/images/news2.jpg",
  },
  {
    id: "3",
    title: "Интервью с победителем гонки",
    summary: "Пилот рассказал о подготовке и стратегии на предстоящий сезон.",
    date: "2025-08-29T10:00:00Z",
  },
];


  const dataCurrentWeekend  = api.mainPageRouter.getCurrentWeekend();


  return (
      <div className="bg-gray-900">
        {/* Пока что так */}
        <CurrentWeekend dataCurrentWeekend = {dataCurrentWeekend}/>
        <WeekendOverview previous={previousWeekend} current={currentWeekend} next={nextWeekend} />
        <News news={newsData} />
      </div>
    )
  }
