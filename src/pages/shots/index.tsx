import * as React from "react";
import { type NextPage } from "next";
import { api } from "~/utils/api";
import {
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";
import Image from "next/image";
import shotMap from "../../assets/shot-map-vertical.svg";
import CustomScatter from "~/components/CustomScatter";

const Shots: NextPage = () => {
  const { data } = api.shots.getShots.useQuery({
    gameId: 304918,
    // teamId: 66,
    // playerId: 69397,
  });

  return (
    <>
      <div className="relative">
        <Image
          placeholder="blur"
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
                <Scatter
                  data={data}
                  shape={(props) => <CustomScatter {...props} />}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shots;
