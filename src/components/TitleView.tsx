import React, { useContext } from "react";

import { DispatchContext } from "./App";
import { Screen } from "../reducer";
import PieceView from "./PieceView";

export default function () {
  const dispatch = useContext(DispatchContext);

  const start = () => {
    dispatch({ type: "change_screen", value: Screen.OpponentSelect });
  };

  return (
    <div id="title">
      <p className="gex-plays">Gex Plays</p>
      <h1>Tokidoki Chess Club</h1>
      <h2>
        <PieceView piece="wP" />
        <span>A Chess Dating Sim</span>
        <PieceView piece="bP" />
      </h2>
      <button onClick={start}>It's Tail Time</button>
    </div>
  );
}
