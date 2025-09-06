import { type Session } from "next-auth";
import Link from "next/link";

export async function Navbar({ session }: { session: Session }) {
  return (
    <div className="navbar bg-gray-800">
      <Link href="/" className="btn">
        Домой
      </Link>
      <Link href="/Calendar" className="btn">
        Календарь
      </Link>
      <Link href="/Championship" className="btn">
        Чемпионат
      </Link>
      <Link href="/Pilots" className="btn">
        Пилоты
      </Link>
      <Link href="/Judicial" className="btn">
        Судейская
      </Link>
      {/* <Link href="/Profile/[id]" className="btn">
        Профиль
      </Link> */}
      <Link href="/api/auth/signout" className="btn">
        {session.user?.name}
        Выход
      </Link>
    </div>
  );
}