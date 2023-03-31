import { type GetStaticProps, type NextPage } from "next";
import Link from "next/link";
import * as React from "react";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const TeamPage: NextPage<{ id: string }> = ({ id }) => {
  const [name, setName] = React.useState<string>();
  const { data: pairs, isLoading } = api.teams.getPlayoffPairsByTeamId.useQuery(
    {
      teamId: Number(id),
    }
  );

  React.useEffect(() => {
    if (pairs && pairs[0]) {
      if (pairs[0]?.firstTeamId === Number(id)) {
        setName(pairs[0].firstTeamName);
      } else {
        setName(pairs[0].secondTeamName);
      }
    }
  }, [id, pairs]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!name) {
    return <p>No team</p>;
  }

  if (!pairs) {
    return <p>No pairs</p>;
  }

  return (
    <>
      <h1 className="text-5xl font-extrabold tracking-tight text-fliiga-yellow sm:text-[5rem]">
        {name}
      </h1>
      <h3 className="-mt-8 text-xl font-bold tracking-tight text-fliiga-yellow sm:text-[2rem]">
        Valitse playoff sarja
      </h3>
      {pairs.length === 1 ? (
        <div className="grid grid-cols-1 gap-4">
          {pairs.map((pair) => (
            <Link
              href={`/shots/${id}/${pair.phase}`}
              className="flex items-center justify-center rounded border border-fliiga-yellow bg-transparent py-2 px-6 font-medium text-white hover:border-transparent hover:bg-fliiga-yellow hover:text-white"
              key={pair.id}
            >
              {pair.firstTeamName} - {pair.secondTeamName}
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {pairs.map((pair) => (
            <Link
              href={`/shots/${id}/${pair.phase}`}
              className="flex items-center justify-center rounded border border-fliiga-yellow bg-transparent py-2 px-6 font-semibold text-white hover:border-transparent hover:bg-fliiga-yellow hover:text-white"
              key={pair.id}
            >
              {pair.firstTeamName} - {pair.secondTeamName}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = Number(context.params?.id);

  if (typeof id !== "number") throw new Error("no id");

  await ssg.teams.getPlayoffPairsByTeamId.prefetch({ teamId: id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = async () => {
  const ssg = generateSSGHelper();

  const teams = await ssg.teams.getAllPlayoffTeams.fetch();
  const paths = teams.map((team) => ({
    params: { id: team.teamId.toString() },
  }));

  return { paths, fallback: "blocking" };
};

export default TeamPage;
