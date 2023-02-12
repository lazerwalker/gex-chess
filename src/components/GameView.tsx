import React, { Component, CSSProperties, useEffect, useState } from "react";
import { Chess, Move, Square } from "chess.js";

import Chessboard from "chessboardjsx";
import ChessEngine, { Engine } from "../engine";

type PlayerType = "human" | "ai";

interface Props {
  white: PlayerType;
  black: PlayerType;
}

export default function (props: Props) {
  const [engine, setEngine] = useState<Engine>();
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState("start");
  const [pieceSquare, setPieceSquare] = useState<string | undefined>();
  const [history, setHistory] = useState<(Move & { fen: string })[]>([]);

  const [dropSquareStyle, setDropSquareStyle] = useState<any>();

  const [lastMoveSquares, setLastMoveSquares] = useState<[Square, Square]>();
  const [possibleMoveSquares, setPossibleMoveSquares] = useState<Square[]>();

  useEffect(() => {
    (async () => {
      const engine = await ChessEngine();
      setEngine(engine);
      engine.addEventListener("bestmove", (move) => {
        console.log("Move", move);
        game.move(move);

        setFen(game.fen());
        setHistory(game.history({ verbose: true }));
        setLastMoveSquares([move.from, move.to]);

        // engine.makeMove(game.fen());
      });

      engine.newGame();
      // engine.makeMove(game.fen());
    })();
  }, []);

  const onDrop = ({ sourceSquare, targetSquare }) => {
    console.log("On drop", sourceSquare, targetSquare);
    // see if the move is legal
    let move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;

    setFen(fen);
    setHistory(game.history({ verbose: true }));
    setLastMoveSquares([sourceSquare, targetSquare]);
  };

  const highlightPossibleMoves = (square: Square, force: boolean = false) => {
    console.log("Highlighting possible moves");
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
    console.log(squaresToHighlight);
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
        game.move({
          from: pieceSquare,
          to: square,
          promotion: "q", // always promote to a queen for example simplicity
        });

        setFen(game.fen());
        setHistory(game.history({ verbose: true }));
        setPieceSquare(undefined);
        setPossibleMoveSquares([]);
      } catch {
        console.log("Invalid move!", pieceSquare, square);
      } finally {
      }
    } else {
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
