import { produce } from "immer";
import { Reducer } from "react";
import { Piece } from "chess.js";

import { GamePieceCount } from "./chessHelpers";

export interface State {
  readonly playerBark?: string;
  readonly enemyBark?: string;
  readonly captured: GamePieceCount;
}

export const defaultState: State = {
  captured: {
    w: {
      q: 0,
      r: 0,
      b: 0,
      n: 0,
      p: 0,
    },
    b: {
      q: 0,
      r: 0,
      b: 0,
      n: 0,
      p: 0,
    },
  },
};

export type Action =
  | { type: "set_player_bark"; value: string }
  | { type: "set_enemy_bark"; value: string }
  | { type: "update_captured_pieces"; value: GamePieceCount };

function throwBadAction(a: never): never;
function throwBadAction(a: Action) {
  throw new Error("Unknown action type: " + a);
}

const reducer: Reducer<State, Action> = (
  state: State,
  action: Action
): State => {
  return produce(state, (draft) => {
    console.log("DEBUG", action, state);
    switch (action.type) {
      case "set_player_bark": {
        draft.playerBark = action.value;
        break;
      }
      case "set_enemy_bark": {
        draft.enemyBark = action.value;
        break;
      }
      case "update_captured_pieces": {
        draft.captured = action.value;
        break;
      }
      default: {
        return throwBadAction(action);
      }
    }
  });
};
export default reducer;
