import { type Prisma } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const parseGames = (games: Prisma.GameCreateManyInput[]) => {
  return games.map((g) => ({
    gameId: g.gameId,
    subSerieId: g.subSerieId,
    providerId: g.providerId,
    season: g.season,
    date: g.date,
    startTime: g.startTime,
    endTime: g.endTime,
    clockTime: g.clockTime,
    finished: g.finished,
    overtime: g.overtime,
    shootout: g.shootout,
    homeTeamId: g.homeTeamId,
    awayTeamId: g.awayTeamId,
    homeScore: g.homeScore,
    awayScore: g.awayScore,
    playoffPair: g.playoffPair,
    playoffPhase: g.playoffPhase,
    playoffPhaseName: g.playoffPhaseName,
    playoffReqWins: g.playoffReqWins,
    spectators: g.spectators,
    totalPeriods: g.totalPeriods,
    createdTime: g.createdTime,
    modifiedTime: g.modifiedTime,
    statGroupId: g.statGroupId,
    serieId: g.serieId,
  }));
};

export const gamesRouter = createTRPCRouter({
  insertPlayoffGames: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.game.deleteMany({});
    const res = await fetch(
      "https://api.fliiga.com/games?statGroupId=7001&season=2023"
    );
    const gameObjects = (await res.json()) as Prisma.GameCreateManyInput[];
    const games = await ctx.prisma.game.createMany({
      data: parseGames(gameObjects),
    });
    return games;
  }),
});
