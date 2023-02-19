import React from "react";
import { GamePieceCount } from "../chessHelpers";
import { EndGameState, WinReason } from "../reducer";
import BoardView from "./BoardView";
import GameOverView from "./GameOverView";
import OpponentView from "./OpponentView";
import PlayerView from "./PlayerView";

interface Props {
  enemyBark?: string;
  playerBark?: string;

  captured: GamePieceCount;
  relativeScore: { b: number; w: number };

  gameOver: boolean;
  winReason?: WinReason;
  endGameState?: EndGameState;
}

export default function (props: Props) {
  return (
    <div>
      <div>
        <OpponentView
          bark={props.enemyBark}
          captured={props.captured["w"]}
          score={props.relativeScore["b"]}
          showScore={false}
        />
        <BoardView w="human" b="ai" />
        <PlayerView
          bark={props.playerBark}
          captured={props.captured["b"]}
          score={props.relativeScore["w"]}
        />
        {props.gameOver ? (
          <GameOverView
            endGameState={props.endGameState!}
            reason={props.winReason!}
          />
        ) : null}
      </div>
    </div>
  );
}
