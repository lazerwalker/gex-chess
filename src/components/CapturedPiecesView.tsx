import React from "react";
import { PieceCount } from "../chessHelpers";
import { Color } from "chess.js";
import PieceView, { PieceName } from "./PieceView";

interface Props {
  captured: PieceCount;
  color: Color;
}

export default function (props: Props) {
  console.log(props.captured);
  const pieces = Object.keys(props.captured).map((key) => {
    const count = props.captured[key];
    return [...Array(count).keys()].map((i) => (
      <PieceView
        key={`key-${props.color}-${i}`}
        piece={`${props.color}${key.toUpperCase()}` as PieceName}
      />
    ));
  });

  return <div>{pieces}</div>;
}
