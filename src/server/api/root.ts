import { createTRPCRouter } from "~/server/api/trpc";
import { gamesRouter } from "./routers/games";
import { playersRouter } from "./routers/players";
import { shotsRouter } from "./routers/shots";
import { teamsRouter } from "./routers/teams";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  shots: shotsRouter,
  players: playersRouter,
  teams: teamsRouter,
  games: gamesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
