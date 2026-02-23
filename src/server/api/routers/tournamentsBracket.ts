import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { number, z } from "zod";
import { isAdmin, isOrganizer, isOrganizerOwner } from "~/app/api/auth/check";
import { TiebreakType, TypeStage } from "@prisma/client";


export const tournametsBracketRouter = createTRPCRouter({


})