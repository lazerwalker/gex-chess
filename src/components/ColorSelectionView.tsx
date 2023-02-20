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
      <h1>Select A Side</h1>
      <center>
        <button onClick={clickWhite} style={{ marginRight: "5px" }}>
          White
        </button>
        <button onClick={clickBlack} style={{ marginLeft: "5px" }}>
          Black
        </button>
      </center>
    </div>
  );
}
