import { type Session } from "next-auth";
import Link from "next/link";

export async function Navbar({ session }: { session: Session }) {
  return (
    <div className="navbar bg-gray-800">
      <Link href="/" className="btn bg-gray-900 text-white mr-2">
        Домой
      </Link>
      <Link href="/calendar" className="btn bg-gray-900 text-white mr-2">
        Календарь
      </Link>
      <Link href="/championship" className="btn bg-gray-900 text-white mr-2">
        Чемпионат
      </Link>
      <Link href="/pilots" className="btn bg-gray-900 text-white mr-2">
        Пилоты
      </Link>
      <Link href="/judicial" className="btn bg-gray-900 text-white mr-2">
        Судейская
      </Link>
      <Link href={`/profile/${session.user.id}`} className="btn bg-gray-900 text-white mr-2">
        Профиль
      </Link>
      <Link href="/api/auth/signout" className="btn bg-gray-900 text-white mr-2">
        {session.user?.name}
        Выход
      </Link>
    </div>
  );
}