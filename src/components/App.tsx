import React, { createContext, Dispatch, StrictMode, useReducer } from "react";
import reducer, { State, Action, defaultState } from "../reducer";
import CapturedPiecesView from "./CapturedPiecesView";
import GameOverView from "./GameOverView";

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
            <OpponentView
              bark={state.enemyBark}
              captured={state.captured["w"]}
              score={state.relativeScore["b"]}
            />
            <PlayableChessBoard w="human" b="ai" />
            <PlayerView
              bark={state.playerBark}
              captured={state.captured["b"]}
              score={state.relativeScore["w"]}
            />
            {state.gameOver ? (
              <GameOverView
                endGameState={state.endGameState!}
                reason={state.winReason!}
              />
            ) : null}
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
