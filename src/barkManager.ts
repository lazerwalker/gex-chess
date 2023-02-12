import { Chess } from "chess.js";

interface Bark {
  // Verbose history, reversed so 0 is most recent
  fn: string; //(move: Move, prev: Move, history: Move[]) => boolean;
  pgn?: string;

  content: string;
}

// *unhinged laughter*
export default function generateBark(game: Chess) {
  function wrappedEval(textExpression: string, contextData: any) {
    try {
      let fn = Function(`"use strict"; return (${textExpression})`);
      return fn.bind(contextData)();
    } catch (e) {
      console.log("Failed: ", e);
      return false;
    }
  }

  const history = [...game.history({ verbose: true })].reverse();
  const possibleBarks = barks.filter((b) => {
    const editedString = b.fn
      .replace(/move/g, "this.move")
      .replace(/prev/g, "this.prev")
      .replace(/history/g, "this.history");
    return wrappedEval(editedString, {
      move: history[0],
      prev: history[1] || {},
      history,
    });
  });

  if (possibleBarks.length > 0) return possibleBarks[0].content;
}

const barks: Bark[] = [];

import rawBarks from "bundle-text:./barks.txt";
const lines = rawBarks.split("\n");
for (let i = 0; i < lines.length; i += 3) {
  if (
    !lines[i] ||
    !lines[i + 1] ||
    lines[i].length === 0 ||
    lines[i + 1].length === 0
  )
    continue;
  const bark = {
    fn: lines[i],
    content: lines[i + 1],
  };

  barks.push(bark);
}
