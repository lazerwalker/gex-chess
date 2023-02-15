import React from "react";

import Gex from "../../libraries/gex.png";
import { PieceCount } from "../chessHelpers";
import CapturedPiecesView from "./CapturedPiecesView";

interface Props {
  bark?: string;
  captured: PieceCount;
  score: number;
}

export default function (props: Props) {
  let scoreDiv;
  if (props.score !== 0) {
    const scoreString = props.score > 0 ? `+${props.score}` : props.score;
    scoreDiv = <div className="score">{scoreString}</div>;
  }

  return (
    <div
      style={{
        marginBottom: "40px",
        height: "120px",
      }}
    >
      <div
        style={{
          backgroundImage: `url("${Gex}")`,
          // border: "2px solid #7C3F58",
          boxSizing: "border-box",
          imageRendering: "pixelated",
          width: "120px",
          height: "120px",
          backgroundSize: "contain",
          float: "right",
          display: "inline-block",
        }}
      />
      <div
        style={{
          boxSizing: "border-box",
          color: "#7C3F58", //00B002
          fontFamily: "'BirdSeed', sans-serif",
          paddingRight: "10px",
          paddingTop: "30px",
          width: "200px",
          textAlign: "right",
          float: "right",
          display: "inline-block",
        }}
      >
        {props.bark}
      </div>
      <CapturedPiecesView color={"w"} captured={props.captured} />
      {scoreDiv}
    </div>
  );
}
