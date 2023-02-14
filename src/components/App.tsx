import React, { createContext, Dispatch, StrictMode, useReducer } from "react";
import reducer, { State, Action, defaultState } from "../reducer";

import PlayableChessBoard from "./GameView";
import OpponentView from "./OpponentView";
import PlayerView from "./PlayerView";

export const DispatchContext = createContext<Dispatch<Action>>(null);

export default function () {
  const [state, dispatch]: [State, Dispatch<Action>] = useReducer(
    reducer,
    defaultState
  );
  return (
    <StrictMode>
      <DispatchContext.Provider value={dispatch}>
        <div>
          <div style={boardsContainer}>
            <OpponentView bark={state.enemyBark} />
            <PlayableChessBoard w="human" b="ai" />
            <PlayerView bark={state.playerBark} />
          </div>
        </div>
      </DispatchContext.Provider>
    </StrictMode>
  );
}

const boardsContainer = {
  width: "320px",
  margin: "auto",
  marginTop: 30,
  marginBottom: 50,
};
