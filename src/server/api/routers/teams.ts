import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type Team } from "../types";

type ResponseType = {
  team: Team;
};

const parseTeams = async () => {
  const res = await fetch("https://api.fliiga.com/standings/7000/2023");
  const teams = (await res.json()) as ResponseType[];
  return teams.map((t) => t.team);
};

export const teamsRouter = createTRPCRouter({
  getAllTeams: publicProcedure.query(async ({ ctx }) => {
    const teams = await ctx.prisma.team.findMany();
    return teams;
  }),
  getTeam: publicProcedure
    .input(z.object({ teamId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!input.teamId) return null;
      const team = await ctx.prisma.team.findFirst({
        where: { teamId: input.teamId },
      });
      return team;
    }),
  initializeTeams: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.team.deleteMany({});
    const parsedTeams = await parseTeams();
    const teams = await ctx.prisma.team.createMany({
      data: parsedTeams,
    });
    return teams;
  }),
});
