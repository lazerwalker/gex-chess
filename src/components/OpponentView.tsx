import React from "react";

import Lady from "../../libraries/pixel-ladies-free/003.png";
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
        marginTop: "20px",
        height: "120px",
        position: "relative",
      }}
    >
      <div
        style={{
          backgroundImage: `url("${Lady}")`,
          boxSizing: "border-box",
          // border: "2px solid #7C3F58",
          imageRendering: "pixelated",
          width: "120px",
          height: "120px",
          backgroundSize: "contain",
          float: "left",
          display: "inline-block",
        }}
      />
      <div
        style={{
          boxSizing: "border-box",
          color: "#7C3F58",
          fontFamily: "'BirdSeed', sans-serif",
          paddingLeft: "5px",
          paddingTop: "10px",
          width: "200px",
          float: "left",
          display: "inline-block",
        }}
      >
        {props.bark}
      </div>
      <div
        style={{
          position: "absolute",
          right: "0px",
          bottom: "0px",
        }}
      >
        <CapturedPiecesView color={"b"} captured={props.captured} />
        {scoreDiv}
      </div>
    </div>
  );
}
