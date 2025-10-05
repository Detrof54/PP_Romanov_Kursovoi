
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { mainPageRouter } from "./routers/mainpage";
import { calendarRouter } from "./routers/calendar";
import { championshipRouter } from "./routers/championship";
import { pilotsRouter } from "./routers/pilots";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    mainPageRouter: mainPageRouter,
    calendarRouter: calendarRouter,
    championshipRouter: championshipRouter,
    pilotsRouter:pilotsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
