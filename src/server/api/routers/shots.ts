import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type Prisma } from "@prisma/client";

// const delay = (time: number) => {
//   return new Promise((resolve) => setTimeout(resolve, time));
// };

const getShots = async (
  gameId: number
): Promise<Prisma.ShotCreateManyInput[]> => {
  // await delay(2000);
  const res = await fetch(`https://api.salibandy.fi/shots/${gameId}`);
  const shots = (await res.json()) as Prisma.ShotCreateInput[];

  return shots.map((s) => ({
    providerId: s.providerId,
    gameProviderId: s.gameProviderId,
    playerProviderId: s.playerProviderId,
    teamProviderId: s.teamProviderId,
    opponentProviderId: s.opponentProviderId,
    opponentTeamProviderId: s.opponentTeamProviderId,
    type: s.type,
    gametime: s.gametime,
    originalX: s.originalX,
    originalY: s.originalY,
    translatedX: s.translatedX,
    translatedY: s.translatedY,
    goalX: s.goalX,
    goalY: s.goalY,
    gameId: s.gameId,
    playerId: s.playerId,
    teamId: s.teamId,
    opponentId: s.opponentId,
    opponentTeamId: s.opponentTeamId,
    opponentNumber: s.opponentNumber,
    playerNumber: s.playerNumber,
  }));
};

const getPlayoffGameIds = async (): Promise<number[]> => {
  const res = await fetch(
    "https://api.salibandy.fi/games?statGroupId=7001&season=2023"
  );
  const games = (await res.json()) as Prisma.GameCreateManyInput[];
  const filtered: number[] = games
    .filter((g) => g.finished !== 0)
    .map((g) => g.gameId);
  return filtered;
};

export const shotsRouter = createTRPCRouter({
  insertAllPlayoffShots: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.shot.deleteMany({});
    const gameIds = await getPlayoffGameIds();
    let shotsArray: Prisma.ShotCreateManyInput[] = [];
    for await (const id of gameIds) {
      const newShots = await getShots(id);
      shotsArray = shotsArray.concat([...newShots]);
    }
    const shots = await ctx.prisma.shot.createMany({
      data: shotsArray,
    });
    return shots;
  }),

  insertShotsByGameId: publicProcedure
    .input(z.object({ gameId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const newShots = await getShots(input.gameId);
      const shots = await ctx.prisma.shot.createMany({
        data: newShots,
      });
      return shots;
    }),

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
