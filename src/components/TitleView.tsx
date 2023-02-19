import React, { useContext } from "react";

import { DispatchContext } from "./App";
import { Screen } from "../reducer";

export default function () {
  const dispatch = useContext(DispatchContext);

  const start = () => {
    dispatch({ type: "change_screen", value: Screen.OpponentSelect });
  };

  return (
    <div>
      <h1>Gex Plays Tokidoki Chess Club</h1>
      <button onClick={start}>It's Tail Time</button>
    </div>
  );
}
