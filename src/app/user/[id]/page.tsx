import Link from "next/link";
import React from "react";
import { deleteUser, updateUser } from "~/app/api/action/user";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { AdminUserForm } from "~/app/_components/user/adminRole";
import { UserInfo } from "~/app/_components/user/userRole";

export default async function Page(
  props: { params: Promise<{ id: string }> }
) {
  const role = (await auth())?.user.role

  const params = await props.params;
  const user = await db.user.findUnique({ where: { id: params.id }, include: {
    group: true,
  } });
  if (!user)
    return (
      <main>
        <h1>User not found</h1>
      </main>
  );

  const groupJSX = user?.group && <><label>Группа</label><Link className="btn"  href={"/group/" + user?.group.id}>{user?.group.name + "-" + user.subgroup}</Link></>;
  
    if (role === "ADMIN") {
      return <AdminUserForm user={user} groupJSX={groupJSX} />;
    }
  
    return <UserInfo user={user} groupJSX={groupJSX} />;
  }

  /*if (role == "ADMIN") return (
    <main>
      <form action={updateUser} className="form-control">
        <div className="flex max-w-xs flex-col space-y-2">
          <input type="hidden" name="id" defaultValue={user.id ?? ""} />
          <label>Электронная почта</label>
          <input
            type="email"
            name="email"
            required
            className="input input-bordered"
            defaultValue={user.email ?? ""}
          />
          <label>Имя</label>
          <input
            type="text"
            name="firstname"
            required
            className="input input-bordered"
            defaultValue={user.firstname ?? ""}
          />
          <label>Фамилия</label>
          <input
            type="text"
            name="surname"
            required
            className="input input-bordered"
            defaultValue={user.surname ?? ""}
          />
          <label>Роль</label>
          <select
            name="role"
            required
            className="select select-bordered"
            defaultValue={user.role ?? "USER"}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="TUTOR">TUTOR</option>
          </select>
          {groupJSX}
          <button type="submit" className="btn btn-primary">
            Обновить
          </button>
        </div>
      </form>
      <form action={deleteUser} className="form-control">
        <div className="flex max-w-xs flex-col space-y-2">
          <input type="hidden" name="id" defaultValue={user.id ?? ""} />
          <button type="submit" className="btn btn-primary">
            Удалить
          </button>
        </div>
      </form>
    </main>
  );

  return (
    <main>
      <h1>Данные пользователя</h1>
      <p>Электронная почта: {user.email}</p>
      <p>Имя: {user.firstname}</p>
      <p>Фамилия: {user.surname}</p>
      <p>Роль: {user.role}</p>
      {groupJSX}
    </main>
  )
}*/