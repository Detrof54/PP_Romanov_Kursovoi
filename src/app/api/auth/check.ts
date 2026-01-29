import { $Enums } from "@prisma/client";
import { auth } from "~/server/auth";

export async function isAdmin() {
    const session = await auth();
    if (!session) return false;
    if (session.user.role !== $Enums.Role.ADMIN)
        return false
    return true
}
export async function isOrganizer() {
    const session = await auth();
    if (!session) return false;
    if (session.user.role !== $Enums.Role.ORGANIZER)
        return false
    return true
}

export async function getId() {
    const session = await auth();
    return session?.user.id
}