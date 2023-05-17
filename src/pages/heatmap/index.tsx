/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useRef } from "react";

interface HeatmapProps {
  xCoords: number[];
  yCoords: number[];
}

const Heatmap: React.FC<HeatmapProps> = ({ xCoords, yCoords }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgRef.current) {
      const svg = svgRef.current;
      const padding = 20;
      const maxRadius = 30;

      const pointCounts: { [key: string]: number } = {};
      const maxCount = xCoords.length;
      for (let i = 0; i < maxCount; i++) {
        const x = xCoords[i];
        const y = yCoords[i];
        const key = `${x!},${y!}`;
        pointCounts[key] = (pointCounts[key] || 0) + 1;
      }

      const maxDensity = Object.values(pointCounts).reduce(
        (max, count) => Math.max(max, count),
        0
      );

      for (let i = 0; i < maxCount; i++) {
        const x = xCoords[i];
        const y = yCoords[i];
        const key = `${x!},${y!}`;
        const count = pointCounts[key];

        const density = count! / maxDensity;
        const radius = (maxRadius * density) / 2;

        const circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        circle.setAttribute("cx", String(x! + padding));
        circle.setAttribute("cy", String(y! + padding));
        circle.setAttribute("r", String(radius));
        circle.setAttribute(
          "fill",
          `rgba(255, 0, 0, ${Math.min(0.2 + 0.8 * density, 1)})`
        );
        // circle.setAttribute("stroke", "#fff");
        // circle.setAttribute("stroke-width", String(pointRadius));
        svg.appendChild(circle);
      }
    }
  }, [xCoords, yCoords]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${600} ${600}`}
      width={600}
      height={600}
      // style={{ border: "1px solid #ccc" }}
    ></svg>
  );
};

const App: React.FC = () => {
  const xCoords = [10, 20, 10, 30, 40, 50, 60, 70, 80, 90, 100, 15, 20];
  const yCoords = [20, 30, 20, 40, 50, 60, 70, 80, 90, 100, 110, 15, 20];

  return <Heatmap xCoords={xCoords} yCoords={yCoords} />;
};

export default App;
