/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type Game, type Team } from "../types";

type PairObject = {
  pair: number;
  phase: number;
  phaseName: string;
  winsNeeded: number;
  firstSeedTeam: {
    details: Team;
    wins: number;
  };
  secondSeedTeam: {
    details: Team;
    wins: number;
  };
  games: Game[];
};

type PairResponseType = {
  [key: string]: PairObject[];
};

type Standing = {
  team: Team;
};

export const teamsRouter = createTRPCRouter({
  insertPlayoffTeams: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.team.deleteMany({});
    const res = await fetch("https://api.fliiga.com/standings/7000/2023");
    const standings = (await res.json()) as Standing[];
    const teams = await ctx.prisma.team.createMany({
      data: standings.slice(0, 8).map((s) => s.team),
    });
    return teams;
  }),

  getAllPlayoffTeams: publicProcedure.query(async ({ ctx }) => {
    const teams = await ctx.prisma.team.findMany();
    return teams;
  }),

  getPlayoffTeamById: publicProcedure
    .input(z.object({ teamId: z.number() }))
    .query(async ({ ctx, input }) => {
      const team = await ctx.prisma.team.findFirst({
        where: { teamId: input.teamId },
      });
      return team;
    }),

  insertPlayoffPairs: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.playoffPair.deleteMany({});
    const res = await fetch(
      "https://api.fliiga.com/games/playoffs?statGroupId=7001&season=2023"
    );

    const pairsMap = (await res.json()) as PairResponseType;
    const pairObjects = Object.values(pairsMap).flat();
    const pairs = await ctx.prisma.playoffPair.createMany({
      data: pairObjects.map((p) => ({
        pair: p.pair,
        phase: p.phase,
        phaseName: p.phaseName,
        winsNeeded: p.winsNeeded,
        firstTeamId: p.firstSeedTeam.details.teamId,
        firstTeamName: p.firstSeedTeam.details.name,
        firstTeamWins: p.firstSeedTeam.wins,
        secondTeamId: p.secondSeedTeam.details.teamId,
        secondTeamName: p.secondSeedTeam.details.name,
        secondTeamWins: p.secondSeedTeam.wins,
      })),
    });

    return pairs;
  }),

  getAllPlayoffPairs: publicProcedure.query(async ({ ctx }) => {
    const pairs = await ctx.prisma.playoffPair.findMany();
    return pairs;
  }),

  getPlayoffPairsByTeamId: publicProcedure
    .input(z.object({ teamId: z.number() }))
    .query(async ({ ctx, input }) => {
      const pairs = await ctx.prisma.playoffPair.findMany({
        where: {
          OR: [{ firstTeamId: input.teamId }, { secondTeamId: input.teamId }],
        },
      });
      return pairs;
    }),
  getPlayoffPair: publicProcedure
    .input(z.object({ teamId: z.number(), phase: z.number() }))
    .query(async ({ ctx, input }) => {
      const pairs = await ctx.prisma.playoffPair.findFirst({
        where: {
          OR: [
            { firstTeamId: input.teamId, phase: input.phase },
            { secondTeamId: input.teamId, phase: input.phase },
          ],
        },
      });
      return pairs;
    }),
});
