import { produce } from "immer";
import { Reducer } from "react";

export interface State {
  readonly playerBark?: string;
  readonly opponentBark?: string;
}

export const defaultState: State = {};

export type Action =
  | { type: "set_player_bark"; value: string }
  | { type: "set_opponent_bark"; value: string };

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
      case "set_opponent_bark": {
        draft.opponentBark = action.value;
        break;
      }
      default: {
        return throwBadAction(action);
      }
    }
  });
};
export default reducer;
