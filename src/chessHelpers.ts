import { Chess, Color, Piece } from "chess.js";

export interface PieceCount {
  p: number;
  n: number;
  b: number;
  r: number;
  q: number;
}

export interface GamePieceCount {
  b: PieceCount;
  w: PieceCount;
}

// via https://github.com/jhlywa/chess.js/issues/82
export function capturedPieces(game: Chess): { [c in Color]: PieceCount } {
  var history = game.history({ verbose: true });
  var initial = {
    w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
    b: { p: 0, n: 0, b: 0, r: 0, q: 0 },
  };

  var captured = history.reduce(function (acc, move) {
    if ("captured" in move) {
      var piece = move.captured;
      // switch colors since the history stores the color of the player doing the
      // capturing, not the color of the captured piece
      var color = move.color == "w" ? "b" : "w";
      acc[color][piece] += 1;
      return acc;
    } else {
      return acc;
    }
  }, initial);

  return captured;
}
