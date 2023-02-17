import React from "react";
import { EndGameState, WinReason } from "../reducer";

import "../modal.css";

interface Props {
  endGameState: EndGameState;
  reason: WinReason;
}

export default function (props: Props) {
  let winString;
  if (props.endGameState === "draw") {
    winString = "You tied!";
  } else if (props.endGameState === "loss") {
    winString = "You lose!";
  } else {
    winString = "You win!";
  }

  let reasonString;
  if (props.reason === "checkmate") {
    reasonString = `You ${
      props.endGameState === "win" ? "won" : "lost"
    } by checkmate.`;
  } else if (props.reason === "stalemate") {
    reasonString = "The game was a stalemate.";
  } else if (props.reason === "draw") {
    reasonString = "The game was a draw.";
  } else if (props.reason === "threefold") {
    reasonString = "The game ended by threefold repetition.";
  }

  const restart = () => {
    window.location.reload();
  };

  return (
    <div className="modal">
      <div className="corner corner1 topleft"></div>
      <div className="corner corner1 topright"></div>
      <div className="corner corner1 bottomleft"></div>
      <div className="corner corner1 bottomright"></div>
      <h2>{winString}</h2>
      <p>{reasonString}</p>
      <button onClick={restart}>Play Again</button>
    </div>
  );
}
