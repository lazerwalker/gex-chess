import React, { Component, CSSProperties, useEffect, useState } from "react";
import { Chess, Color, Move, Square } from "chess.js";

import Chessboard from "chessboardjsx";
import ChessEngine, { Engine } from "../engine";

type PlayerType = "human" | "ai";

interface Props {
  w: PlayerType;
  b: PlayerType;
}

export default function (props: Props) {
  const [engine, setEngine] = useState<Engine>();
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState("start");
  const [pieceSquare, setPieceSquare] = useState<Square | undefined>();
  const [history, setHistory] = useState<(Move & { fen: string })[]>([]);

  const [currentMoveColor, setCurrentMoveColor] = useState<Color>("w");

  const [dropSquareStyle, setDropSquareStyle] = useState<any>();

  const [lastMoveSquares, setLastMoveSquares] = useState<[Square, Square]>();
  const [possibleMoveSquares, setPossibleMoveSquares] = useState<Square[]>();

  useEffect(() => {
    (async () => {
      const engine = await ChessEngine();
      setEngine(engine);
      engine.addEventListener("bestmove", (move) => {
        makeMove(move);
      });

      engine.newGame();
    })();
  }, []);

  const makeMove = (move: Move | Partial<Move>) => {
    const finishedMove = game.move(move as Move);

    setFen(game.fen());
    setHistory(game.history({ verbose: true }));
    setLastMoveSquares([finishedMove.from, finishedMove.to]);

    setPieceSquare(undefined);
    setPossibleMoveSquares([]);

    const playerType = props[game.turn()];
    if (playerType === "ai") {
      if (!engine) {
        console.log("RACE CONDITION: Engine does not exist yet");
        return;
      }
      engine.makeMove(game.fen());
    }
  };

  const onDrop = ({ sourceSquare, targetSquare }) => {
    try {
      makeMove({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to a queen for example simplicity
      });
    } catch (e) {
      console.log("Could not make drop move", sourceSquare, targetSquare, e);
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
    setDropSquareStyle(
      square === "e4" || square === "d4" || square === "e5" || square === "d5"
        ? { backgroundColor: "cornFlowerBlue" }
        : { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" }
    );
  };

  const onSquareClick = (square: Square) => {
    if (pieceSquare) {
      if (pieceSquare === square) {
        setPieceSquare(undefined);
        setPossibleMoveSquares([]);
        return;
      }

      // TODO: Un-hardcode
      const existingPiece = game.get(square);
      if (existingPiece?.color === "w") {
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

    const normalHighlight = { backgroundColor: "rgba(255, 255, 0, 0.4)" };
    const possibleHighlight = {
      background: "radial-gradient(circle, #fffc00 36%, transparent 40%)",
      borderRadius: "50%",
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
      width={320}
      position={fen}
      onDrop={onDrop}
      onMouseOverSquare={onMouseOverSquare}
      onMouseOutSquare={onMouseOutSquare}
      onDragOverSquare={onDragOverSquare}
      onSquareClick={onSquareClick}
      boardStyle={{
        borderRadius: "5px",
        boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
      }}
      squareStyles={squareStyles()}
      dropSquareStyle={dropSquareStyle}
    />
  );
}
