import { type GetStaticProps, type NextPage } from "next";
import Link from "next/link";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data } = api.teams.getAllTeams.useQuery();

  return (
    <>
      <h1 className="text-5xl font-extrabold tracking-tight text-fliiga-yellow sm:text-[5rem]">
        Laukaisukartat
      </h1>
      <h3 className="text-xl font-bold tracking-tight text-fliiga-yellow sm:text-[2rem]">
        Aloita valitsemalla playoff-joukkue
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {data &&
          data.slice(0, 8).map((team) => (
            <Link
              href={`teams/${team.teamId}`}
              className="flex items-center justify-center rounded border border-fliiga-yellow bg-transparent py-2 px-6 font-semibold text-white hover:border-transparent hover:bg-fliiga-yellow hover:text-white"
              key={team.id}
            >
              {team.name}
            </Link>
          ))}
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = Number(context.params?.id);

  if (typeof id !== "number") throw new Error("no id");

  await ssg.teams.getAllTeams.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

export default Home;
