import Link from "next/link";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import {Navbar} from "~/app/_components/navbar"
import {SigninLink} from "~/app/_components/signlink"

export default async function Home() {
  const session = await auth();
  
  console.log(session?.user.role);
  //return <h1>Main page</h1>
  return (
      <>
        <h1>Main page</h1>
        <h1>{session?.user.role}</h1>
      </>
    )
  }
