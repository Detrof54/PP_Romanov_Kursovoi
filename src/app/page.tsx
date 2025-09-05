import Link from "next/link";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import {Navbar} from "~/app/_components/navbar"
import {SigninLink} from "~/app/_components/signlink"
import CurrentWeekend from "./_components/main/CurrentWeekend";

export default async function Home() {
  // const session = await auth();
  //return <h1>Main page</h1>

  
  return (
      <>
        <h1>Главная страница</h1>
        <CurrentWeekend
          city="Рязань"
          nameTrassa="Autodromo Nazionale"
          seasonYear={2025}
          events={[
            { id: "1", type: "TEST_RACE", data: "2025-09-06T12:00:00Z" },
            { id: "2", type: "QUALIFICATION", data: "2025-09-06T16:00:00Z" },
            { id: "3", type: "RACE", data: "2025-09-07T14:00:00Z" },
          ]}
        />
        <h2>Здесь будет Предыдущая гонка, текущая, следующая</h2>
        <h2>Новости</h2>
      </>
    )
  }
