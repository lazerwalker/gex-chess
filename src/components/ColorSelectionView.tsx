import React, { useContext } from "react";

import { DispatchContext } from "./App";
import { Screen } from "../reducer";
import PieceView from "./PieceView";

export default function () {
  const dispatch = useContext(DispatchContext);

  const clickWhite = () => {
    dispatch({ type: "select_color", value: "w" });
  };

  const clickBlack = () => {
    dispatch({ type: "select_color", value: "b" });
  };

  return (
    <div id="title">
      <h1>Select Side</h1>
      <button onClick={clickWhite}>
        <PieceView piece="wP" />
        White
      </button>
      <button onClick={clickBlack}>
        <PieceView piece="bP" />
        Black
      </button>
    </div>
  );
}
