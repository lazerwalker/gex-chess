import React, { useContext } from "react";

import { DispatchContext } from "./App";
import { Screen } from "../reducer";

export default function () {
  const dispatch = useContext(DispatchContext);

  const start = () => {
    dispatch({ type: "change_screen", value: Screen.Game });
  };

  return (
    <div>
      <h1>Select An Opponent</h1>
      <button onClick={start}>A Lady</button>
    </div>
  );
}
