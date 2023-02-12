import React, { CSSProperties, useEffect, useState } from "react";
import { Chess, Move, Square } from "chess.js";

import WhitePiecesSheet from "../../libraries/pixelchess_v1.2/WhitePieces-Sheet.png";
import BlackPiecesSheet from "../../libraries/pixelchess_v1.2/BlackPieces-Sheet.png";

import Chessboard, { Piece } from "chessboardjsx";
import ChessEngine, { Engine } from "../engine";
import generateBark from "../barkManager";

type PlayerType = "human" | "ai";

interface Props {
  w: PlayerType;
  b: PlayerType;
}

type PieceImage = { src: string; alt: string; offset: number; height: number };

const pieces: { [p in Piece]: PieceImage } = {
  bP: { src: BlackPiecesSheet, alt: "Black Pawn", offset: 0, height: 16 },
  bN: { src: BlackPiecesSheet, alt: "Black Knight", offset: 1, height: 20 },
  bR: { src: BlackPiecesSheet, alt: "Black Rook", offset: 2, height: 19 },
  bB: { src: BlackPiecesSheet, alt: "Black Bishop", offset: 3, height: 21 },
  bQ: { src: BlackPiecesSheet, alt: "Black Queen", offset: 4, height: 24 },
  bK: { src: BlackPiecesSheet, alt: "Black King", offset: 5, height: 27 },
  wP: { src: WhitePiecesSheet, alt: "White Pawn", offset: 0, height: 16 },
  wN: { src: WhitePiecesSheet, alt: "White Knight", offset: 1, height: 20 },
  wR: { src: WhitePiecesSheet, alt: "White Rook", offset: 2, height: 19 },
  wB: { src: WhitePiecesSheet, alt: "White Bishop", offset: 3, height: 21 },
  wQ: { src: WhitePiecesSheet, alt: "White Queen", offset: 4, height: 24 },
  wK: { src: WhitePiecesSheet, alt: "White King", offset: 5, height: 27 },
};

export default function (props: Props) {
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
    engine.addEventListener("bestmove", (move) => {
      makeMove(move);
    });

    engine.newGame();
    if (props.w === "ai") {
      engine.makeMove(game.fen());
    }
  }, [engine]);

  const makeMove = (move: Move | Partial<Move>) => {
    const finishedMove = game.move(move as Move);

    setFen(game.fen());
    setHistory(game.history({ verbose: true }));
    setLastMoveSquares([finishedMove.from, finishedMove.to]);

    setPieceSquare(undefined);
    setPossibleMoveSquares([]);

    const bark = generateBark(game);
    console.log(bark);

    let utterance = new SpeechSynthesisUtterance(bark);
    speechSynthesis.speak(utterance);

    console.log(game.pgn());

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

    const normalHighlight = { backgroundColor: "#F9A974" };
    const possibleHighlight = {
      background: "radial-gradient(circle, #F9A974 36%, transparent 40%)",
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
        // boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
        // transform: "rotateX(60deg) rotateY(0deg) rotateZ(-10deg)",
      }}
      lightSquareStyle={{
        backgroundColor: "#FFF6D3",
      }}
      darkSquareStyle={{
        backgroundColor: "#7C3F58",
      }}
      squareStyles={squareStyles()}
      dropSquareStyle={dropSquareStyle}
      pieces={objectMap(pieces, (p: PieceImage) => {
        return ({ squareWidth, isDragging }) => (
          <div
            style={{
              width: "16px",
              height: p.height,
              imageRendering: "pixelated",
              position: "relative",
              backgroundImage: `url("${p.src}")`,
              backgroundPosition: `${-p.offset * 16}px ${p.height}px`,
              transform: `scale(2)`,
              transformOrigin: "bottom center",
              top: `${32 - p.height - 3}px`,
            }}
            // alt={p.alt}
          />
        );
      })}
    />
  );
}

const objectMap = (obj, fn) =>
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));
