import { produce } from "immer";
import { Reducer } from "react";

export interface State {
  readonly playerBark?: string;
  readonly enemyBark?: string;
}

export const defaultState: State = {};

export type Action =
  | { type: "set_player_bark"; value: string }
  | { type: "set_enemy_bark"; value: string };

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
      default: {
        return throwBadAction(action);
      }
    }
  });
};
export default reducer;
