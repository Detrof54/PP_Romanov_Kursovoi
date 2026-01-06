import { $Enums } from "@prisma/client";
import { auth } from "~/server/auth";

export async function isAdmin() {
    const session = await auth();
    if (!session) return false;
    if (session.user.role !== $Enums.Role.ADMIN)
        return false
    return true
}

export async function isPilot() {
    const session = await auth();
    if (!session) return false;
    if (session.user.role !== $Enums.Role.PILOT)
        return false
    return true
}

export async function isJudical() {
    const session = await auth();
    if (!session) return false;
    if (session.user.role !== $Enums.Role.JUDGE)
        return false
    return true
}

export async function isUser() {
    const session = await auth();
    if (!session) return false;
    if (session.user.role !== $Enums.Role.USER)
        return false
    return true
}

export async function getiDJudical() {
    const session = await auth();
    return session?.user.id
}

export async function getId() {
    const session = await auth();
    return session?.user.id
}