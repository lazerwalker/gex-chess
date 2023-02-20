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
      <p className="gex-plays">Gex Plays</p>
      <h1>Tokidoki Chess Club</h1>
      <h2>
        <PieceView piece="wP" />
        <span>A Chess Dating Sim</span>
        <PieceView piece="bP" />
      </h2>
      <center>
        <button onClick={clickWhite} style={{ marginRight: "5px" }}>
          Play as White
        </button>
        <button onClick={clickBlack} style={{ marginLeft: "5px" }}>
          Play as Black
        </button>
        <p>
          A game for{" "}
          <a href="https://itch.io/jam/gex-jam-2023" target="_blank">
            Gex Jam 2023
          </a>
          <br />
          by{" "}
          <a href="https://lazerwalker.com" target="_blank">
            Emilia Lazer-Walker
          </a>
        </p>
      </center>
    </div>
  );
}
