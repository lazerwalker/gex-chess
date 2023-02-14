import React from "react";

type PieceImage = { src: string; alt: string; offset: number; height: number };

import WhitePiecesSheet from "../../libraries/pixelchess_v1.2/WhitePieces-Sheet.png";
import BlackPiecesSheet from "../../libraries/pixelchess_v1.2/BlackPieces-Sheet.png";

export type PieceName =
  | "bP"
  | "bN"
  | "bR"
  | "bB"
  | "bQ"
  | "bK"
  | "wP"
  | "wN"
  | "wR"
  | "wB"
  | "wQ"
  | "wK";

const pieces: { [p in PieceName]: PieceImage } = {
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

interface Props {
  piece: PieceName;
}

export const customPieces = () => {
  console.log(pieces);
  const result = objectMap(pieces, (p: PieceImage, n: PieceName) => {
    return () => <PieceView piece={n} />;
  });
  return result;
};

function PieceView(props: Props) {
  const p = pieces[props.piece];
  console.log(props, p);
  return (
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
}

export default PieceView;

function objectMap(obj, fn) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)])
  );
}
