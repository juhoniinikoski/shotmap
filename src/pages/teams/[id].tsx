import { type GetStaticProps, type NextPage } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const TeamPage: NextPage<{ id: string }> = ({ id }) => {
  const { data: team, isLoading } = api.teams.getTeam.useQuery({
    teamId: Number(id),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!team) {
    return <p>No team</p>;
  }

  return (
    <>
      <h1 className="text-5xl font-extrabold tracking-tight text-fliiga-yellow sm:text-[5rem]">
        {team.name}
      </h1>
      <h3 className="text-xl font-bold tracking-tight text-fliiga-yellow sm:text-[2rem]">
        Valitse vielä playoff sarja
      </h3>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = Number(context.params?.id);

  if (typeof id !== "number") throw new Error("no id");

  await ssg.teams.getTeam.prefetch({ teamId: id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default TeamPage;
