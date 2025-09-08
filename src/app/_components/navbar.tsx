import { type Session } from "next-auth";
import Link from "next/link";

export async function Navbar({ session }: { session: Session }) {
  return (
    <div className="navbar bg-gray-800">
      <Link href="/" className="btn bg-gray-900 text-white ">
        Домой
      </Link>
      <Link href="/calendar" className="btn bg-gray-900 text-white">
        Календарь
      </Link>
      <Link href="/Championship" className="btn bg-gray-900 text-white">
        Чемпионат
      </Link>
      <Link href="/Pilots" className="btn bg-gray-900 text-white">
        Пилоты
      </Link>
      <Link href="/Judicial" className="btn bg-gray-900 text-white">
        Судейская
      </Link>
      {/* <Link href="/Profile/[id]" className="btn">
        Профиль
      </Link> */}
      <Link href="/api/auth/signout" className="btn bg-gray-900 text-white">
        {session.user?.name}
        Выход
      </Link>
    </div>
  );
}