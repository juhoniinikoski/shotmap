import * as React from "react";
import { type GetStaticProps, type NextPage } from "next";
import { api } from "~/utils/api";
import {
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";
import Image from "next/image";
import shotMap from "../../../assets/shot-map-vertical.svg";
import CustomScatter from "~/components/CustomScatter";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

type Props = {
  teamId: number;
  phase: number;
};

const Shots: NextPage<Props> = ({ teamId, phase }) => {
  const { data: pair } = api.teams.getPlayoffPair.useQuery(
    { teamId, phase },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  const { data: shots, isFetching } = api.shots.getPlayoffShots.useQuery(
    {
      teamId,
      phase,
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const name = pair
    ? pair.firstTeamId === teamId
      ? pair.firstTeamName
      : pair.secondTeamName
    : "";
  const opponentName = pair
    ? pair.firstTeamId === teamId
      ? pair.secondTeamName
      : pair.firstTeamName
    : "";

  const year = Number(pair?.createdAt.toDateString().split(" ")[3]);

  const memoScatter = React.useMemo(() => {
    // this avoids component to animate twice if there already is cached data
    if (isFetching) return;
    return (
      <Scatter data={shots} shape={(props) => <CustomScatter {...props} />} />
    );
  }, [shots, isFetching]);

  return (
    <>
      <h1 className="text-5xl font-extrabold text-fliiga-yellow">{name}</h1>
      <div className="-mt-10 flex gap-1">
        <p className="text-md text-fliiga-yellow">{year - 1} -</p>
        <p className="text-md text-fliiga-yellow">{year}</p>
        <p className="text-md text-fliiga-yellow">
          {pair?.phaseName.toLowerCase()}
        </p>
      </div>
      <p className="-mt-12 text-lg font-bold text-fliiga-yellow">
        vs {opponentName}
      </p>
      <div className="relative -mt-4">
        <>
          <Image
            placeholder="blur"
            priority
            blurDataURL={"../../assets/shot-map-vertical.svg"}
            src={shotMap} // eslint-disable-line
            alt="shot map"
          />
          <div className="absolute top-0 right-0 bottom-0 left-0 m-auto flex items-center justify-center">
            <div className="absolute h-4/5 w-5/4 -rotate-90 -scale-y-100">
              <ResponsiveContainer>
                <ScatterChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                  <XAxis
                    hide
                    dataKey="translatedX"
                    type="number"
                    domain={[-127.5, 510]}
                  />
                  <YAxis
                    hide
                    dataKey="translatedY"
                    type="number"
                    domain={[-250, 250]}
                  />
                  {memoScatter}
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-scatter-green"></div>
          <p className="text-white">Maali</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-scatter-yellow"></div>
          <p className="text-white">Torjuttu</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-scatter-orange"></div>
          <p className="text-white">Peitetty</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-scatter-red"></div>
          <p className="text-white">Ohilaukaus</p>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const teamId = Number(context.params?.teamId);
  const phase = Number(context.params?.phase);

  if (typeof teamId !== "number") throw new Error("no team id");
  if (typeof phase !== "number") throw new Error("no phase id");

  await ssg.teams.getPlayoffPair.prefetch({ teamId, phase });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      teamId,
      phase,
    },
  };
};

export const getStaticPaths = async () => {
  const ssg = generateSSGHelper();
  const pairs = await ssg.teams.getAllPlayoffPairs.fetch();
  const paths = pairs.flatMap((pair) => [
    {
      params: {
        teamId: pair.firstTeamId.toString(),
        phase: pair.phase.toString(),
      },
    },
    {
      params: {
        teamId: pair.secondTeamId.toString(),
        phase: pair.phase.toString(),
      },
    },
  ]);
  return { paths, fallback: "blocking" };
};

export default Shots;
