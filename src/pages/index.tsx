import { type GetStaticProps, type NextPage } from "next";
import Link from "next/link";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data } = api.teams.getAllPlayoffTeams.useQuery();

  // const { mutate: insertPlayoffTeams } =
  //   api.teams.insertPlayoffTeams.useMutation();
  // const { mutate: insertPairs } = api.teams.insertPlayoffPairs.useMutation();
  // const { mutate: insertPlayoffGames } =
  //   api.games.insertPlayoffGames.useMutation();
  // const { mutate: insertPlayers } =
  //   api.players.insertPlayoffPlayers.useMutation();
  // const { mutate: insertAllPlayoffShots } =
  //   api.shots.insertAllPlayoffShots.useMutation();
  // const { mutate: insertShotsByGameId } =
  //   api.shots.insertShotsByGameId.useMutation();

  // const handleInsert = () => {
  //   insertAllPlayoffShots();
  // };

  return (
    <>
      <h1 className="text-5xl font-extrabold tracking-tight text-fliiga-yellow sm:text-[5rem]">
        Laukaisukartat
      </h1>
      <h4 className="text-md -mt-10 font-bold tracking-tight text-fliiga-yellow sm:text-[1.2rem]">
        F-Liiga playoffs 2023
      </h4>
      <h3 className="text-xl font-bold tracking-tight text-fliiga-yellow sm:text-[2rem]">
        Aloita valitsemalla playoff-joukkue
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {data &&
          data.slice(0, 8).map((team) => (
            <Link
              href={`teams/${team.teamId}`}
              className="flex items-center justify-center rounded border border-fliiga-yellow bg-transparent py-2 px-6 font-medium text-white hover:border-transparent hover:bg-fliiga-yellow hover:text-white"
              key={team.id}
            >
              {team.name}
            </Link>
          ))}
      </div>
      {/* <button className="text-white" onClick={handleInsert}>
        Click here to insert all playoffs shots
      </button> */}
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = Number(context.params?.id);

  if (typeof id !== "number") throw new Error("no id");

  await ssg.teams.getAllPlayoffTeams.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

export default Home;
