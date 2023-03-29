import * as React from "react";
import { type ScatterProps as OriginalScatterProps } from "recharts";

interface ScatterProps extends OriginalScatterProps {
  payload: {
    type: "missed" | "blocked" | "goal" | "saved";
  };
}

const CustomScatter = (props: ScatterProps) => {
  const {
    cx,
    cy,
    payload: { type },
  } = props;

  console.log(props);

  if (cx && cy && cx === +cx && cy === +cy) {
    if (type === "goal") {
      return <circle cx={cx} cy={cy} r="8" className="fill-scatter-green" />;
    } else if (type === "saved") {
      return <circle cx={cx} cy={cy} r="8" className="fill-scatter-yellow" />;
    }
    return <circle cx={cx} cy={cy} r="8" className="fill-scatter-red" />;
  }
  return null;
};

export default CustomScatter;
