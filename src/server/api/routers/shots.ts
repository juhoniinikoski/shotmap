// /* eslint-disable @typescript-eslint/no-unsafe-return */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

// added latest shots at 26.3. 14.23

export const shotsRouter = createTRPCRouter({
  initializeShots: publicProcedure.mutation(async ({ ctx }) => {
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
});
