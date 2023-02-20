import { Color } from "chess.js";
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

  playerColor: Color;
}

export default function (props: Props) {
  const enemyColor = props.playerColor === "b" ? "w" : "b";
  return (
    <div>
      <div>
        <OpponentView
          bark={props.enemyBark}
          captured={props.captured[props.playerColor]}
          score={props.relativeScore[enemyColor]}
          showScore={false}
        />
        <BoardView
          w={props.playerColor === "w" ? "human" : "ai"}
          b={props.playerColor === "b" ? "human" : "ai"}
        />
        <PlayerView
          bark={props.playerBark}
          captured={props.captured[enemyColor]}
          score={props.relativeScore[props.playerColor]}
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
