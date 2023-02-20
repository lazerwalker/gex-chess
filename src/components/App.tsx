import React, { createContext, Dispatch, StrictMode, useReducer } from "react";
import reducer, { State, Action, Screen, defaultState } from "../reducer";
import ColorSelectionView from "./ColorSelectionView";
import GameView from "./GameView";
import OpponentSelectView from "./OpponentSelectView";
import TitleView from "./TitleView";

export const DispatchContext = createContext<Dispatch<Action>>(null);

export default function () {
  const [state, dispatch]: [State, Dispatch<Action>] = useReducer(
    reducer,
    defaultState
  );

  return (
    <StrictMode>
      <DispatchContext.Provider value={dispatch}>
        {state.screen === Screen.Title ? <TitleView /> : null}
        {state.screen === Screen.OpponentSelect ? <OpponentSelectView /> : null}
        {state.screen === Screen.ColorSelect ? <ColorSelectionView /> : null}
        {state.screen === Screen.Game ? (
          <GameView
            captured={state.captured}
            playerBark={state.playerBark}
            enemyBark={state.enemyBark}
            gameOver={state.gameOver}
            endGameState={state.endGameState}
            relativeScore={state.relativeScore}
            playerColor={state.playerColor!}
          />
        ) : null}
      </DispatchContext.Provider>
    </StrictMode>
  );
}
