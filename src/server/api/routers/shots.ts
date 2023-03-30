import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type Shot, type Game } from "../types";

const delay = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

const getShots = async (gameId: number) => {
  await delay(2000);
  const res = await fetch(`https://api.salibandy.fi/shots/${gameId}`);
  const shots = (await res.json()) as Shot[];
  for (const s of shots) {
    delete s.opponent;
    delete s.opponentTeam;
    delete s.team;
    delete s.player;
  }
  return shots;
};

const getPlayoffGameIds = async (): Promise<number[]> => {
  const res = await fetch(
    "https://api.salibandy.fi/games?statGroupId=7001&season=2023"
  );
  const games = (await res.json()) as Game[];
  const filtered: number[] = games //eslint-disable-line
    .filter((g: any) => g.finished !== 0) // eslint-disable-line
    .map((g: any) => g.gameId); // eslint-disable-line
  return filtered;
};

export const shotsRouter = createTRPCRouter({
  insertAllPlayoffShots: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.shot.deleteMany({});
    const gameIds = await getPlayoffGameIds();
    let shotsArray: any[] = []; // eslint-disable-line
    for await (const id of gameIds) {
      const newShots = await getShots(id);
      shotsArray = shotsArray.concat([...newShots]);
    }
    const shots = await ctx.prisma.shot.createMany({
      data: shotsArray,
    });
    return shots;
  }),

  // insertShotsByGameId

  getShots: publicProcedure
    .input(
      z.object({
        gameId: z.number(),
        teamId: z.number().optional(),
        playerId: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const shots = await ctx.prisma.shot.findMany({
        where: {
          gameId: input.gameId,
          teamId: input?.teamId,
          playerId: input?.playerId,
        },
      });
      return shots;
    }),

  getPlayoffShots: publicProcedure
    .input(
      z.object({
        teamId: z.number(),
        phase: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      // get games of the phase where given team is present
      const games = await ctx.prisma.game.findMany({
        where: {
          OR: [
            { homeTeamId: input.teamId, playoffPhase: input.phase },
            { awayTeamId: input.teamId, playoffPhase: input.phase },
          ],
        },
      });

      const shots = await ctx.prisma.shot.findMany({
        where: {
          teamId: input.teamId,
          gameId: {
            in: games.map((g) => g.gameId),
          },
        },
      });
      return shots;
    }),
});
