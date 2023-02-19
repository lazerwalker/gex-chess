import React, { CSSProperties, useEffect, useState, useContext } from "react";
import { Chess, Move, Square } from "chess.js";
import { Chessboard } from "react-chessboard";

import { DispatchContext } from "./App";
import ChessEngine, { Engine } from "../engine";
import { generateEnemyBark, generateGexBark } from "../barkManager";
import { customPieces } from "./PieceView";
import { capturedPieces } from "../chessHelpers";
import { EndGameState, WinReason } from "../reducer";

type PlayerType = "human" | "ai";

interface Props {
  w: PlayerType;
  b: PlayerType;
}

export default function (props: Props) {
  const dispatch = useContext(DispatchContext);

  const [engine, setEngine] = useState<Engine>();
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState("start");
  const [pieceSquare, setPieceSquare] = useState<Square | undefined>();
  const [history, setHistory] = useState<(Move & { fen: string })[]>([]);

  const [dropSquareStyle, setDropSquareStyle] = useState<any>();

  const [lastMoveSquares, setLastMoveSquares] = useState<[Square, Square]>();
  const [possibleMoveSquares, setPossibleMoveSquares] = useState<Square[]>();

  useEffect(() => {
    ChessEngine().then((e) => setEngine(e));
  }, []);

  useEffect(() => {
    if (!engine) return;
    engine.addEventListener("bestmove", (move: Move, score: number) => {
      console.log("Score after move", score);
      makeMove(move);
    });

    engine.newGame();
    if (props.w === "ai") {
      engine.makeMove(game.fen());
    }
  }, [engine]);

  const makeMove = (move: Move | Partial<Move>) => {
    const finishedMove = game.move(move as Move);
    // Instant checkmate
    // game.load("rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3");

    setFen(game.fen());

    setHistory(game.history({ verbose: true }));
    setLastMoveSquares([finishedMove.from, finishedMove.to]);

    setPieceSquare(undefined);
    setPossibleMoveSquares([]);

    // If it's the AI's turn, Gex just moved and should bark (and vice versa)
    if (props[game.turn()] === "ai") {
      dispatch({ type: "set_player_bark", value: generateGexBark(game) });
    } else {
      dispatch({ type: "set_enemy_bark", value: generateEnemyBark(game) });
    }

    console.log(game.pgn());

    if (game.isGameOver()) {
      let reason: WinReason = "checkmate";
      let endGameState: EndGameState = "draw";
      if (game.isCheckmate()) {
        reason = "checkmate";
        if (props[game.turn()] === "human") {
          endGameState = "loss";
        } else {
          endGameState = "win";
        }
      } else if (game.isDraw()) {
        reason = "draw";
      } else if (game.isStalemate()) {
        reason = "stalemate";
      } else if (game.isThreefoldRepetition()) {
        reason = "threefold";
      }

      dispatch({ type: "end_game", value: { endGameState, reason } });
    }

    if (finishedMove.captured) {
      dispatch({ type: "update_captured_pieces", value: capturedPieces(game) });
    }

    const playerType = props[game.turn()];
    if (playerType === "ai") {
      if (!engine) {
        console.log("RACE CONDITION: Engine does not exist yet");
        return;
      }
      engine.makeMove(game.fen());
    }
  };

  const onDrop = (sourceSquare: Square, targetSquare: Square): boolean => {
    try {
      makeMove({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to a queen for example simplicity
      });
      return true;
    } catch (e) {
      console.log("Could not make drop move", sourceSquare, targetSquare, e);
      return false;
    }
  };

  const highlightPossibleMoves = (square: Square, force: boolean = false) => {
    // get list of possible moves for this square
    let moves: Move[] = game.moves({
      square: square,
      verbose: true,
    });

    if (moves.length === 0 && !force) {
      return;
    }

    let squaresToHighlight: Square[] = [];
    for (var i = 0; i < moves.length; i++) {
      squaresToHighlight.push(moves[i].to);
    }
    setPossibleMoveSquares(squaresToHighlight);
  };

  const onMouseOverSquare = (square: Square) => {
    if (pieceSquare) return;
    highlightPossibleMoves(square);
  };

  const onMouseOutSquare = (square: Square) => {
    if (pieceSquare) return;
    setPossibleMoveSquares([]);
  };

  // central squares get diff dropSquareStyles
  const onDragOverSquare = (square) => {
    const style = possibleMoveSquares?.includes(square) // CHECK if move is valid
      ? { backgroundColor: "#F9A974" }
      : {};
    setDropSquareStyle(style);
  };

  const onSquareClick = (square: Square) => {
    if (props[game.turn()] !== "human") {
      console.log("Clicking on the AI turn");
      return;
    }

    if (pieceSquare) {
      if (pieceSquare === square) {
        setPieceSquare(undefined);
        setPossibleMoveSquares([]);
        return;
      }

      const existingPiece = game.get(square);
      if (existingPiece?.color === game.turn()) {
        setPieceSquare(square);
        highlightPossibleMoves(square, true);
        return;
      }

      try {
        // Will throw if move is invalid
        makeMove({
          from: pieceSquare,
          to: square,
          promotion: "q", // always promote to a queen for example simplicity
        });
      } catch (e) {
        console.log("Invalid move!", pieceSquare, square, e);
      } finally {
      }
    } else {
      let moves: Move[] = game.moves({
        square: square,
        verbose: true,
      });
      if (moves.length === 0) return;
      setPieceSquare(square);
    }
  };

  const squareStyles = () => {
    const styles: { [square in Square]?: CSSProperties } = {};

    const normalHighlight = { backgroundColor: "#EB6A6F" };
    const possibleHighlight = {
      background: "radial-gradient(circle, #F9A974 50%, transparent 40%)",
      borderRadius: "90%",
      cursor: "pointer",
    };

    if (lastMoveSquares) {
      styles[lastMoveSquares[0]] = normalHighlight;
      styles[lastMoveSquares[1]] = normalHighlight;
    }

    if (pieceSquare) {
      styles[pieceSquare] = normalHighlight;
    }

    if (possibleMoveSquares) {
      possibleMoveSquares.forEach((s) => {
        styles[s] = possibleHighlight;
      });
    }

    return styles;
  };

  return (
    <Chessboard
      id="game"
      position={fen}
      onPieceDrop={onDrop}
      onMouseOverSquare={onMouseOverSquare}
      onMouseOutSquare={onMouseOutSquare}
      onDragOverSquare={onDragOverSquare}
      onSquareClick={onSquareClick}
      snapToCursor={false} // TODO: Would like this to be true, but needs sorting out the center of the images
      customBoardStyle={
        {
          // borderRadius: "5px",
          // boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
          // transform: "rotateX(60deg) rotateY(0deg) rotateZ(-10deg)",
        }
      }
      customLightSquareStyle={{
        backgroundColor: "#FFF6D3",
      }}
      customDarkSquareStyle={{
        backgroundColor: "#7C3F58",
      }}
      customSquareStyles={squareStyles()}
      customDropSquareStyle={dropSquareStyle}
      customPieces={customPieces()}
    />
  );
}
