import { type Prisma } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type StatResult = {
  player: Prisma.PlayerCreateManyInput;
};

const parsePlayers = async () => {
  const res = await fetch(
    "https://api.fliiga.com/playerStats/statGroup/7001?season=2023"
  );
  const players = (await res.json()) as StatResult[];
  return players.map((p) => p.player);
};

export const playersRouter = createTRPCRouter({
  insertPlayoffPlayers: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.player.deleteMany({});
    const parsedPlayers = await parsePlayers();
    const players = await ctx.prisma.player.createMany({
      data: parsedPlayers,
    });
    return players;
  }),
});
