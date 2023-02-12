import { Chess } from "chess.js";
import { sample } from "lodash";

interface Bark {
  // Verbose history, reversed so 0 is most recent
  fn: string; //(move: Move, prev: Move, history: Move[], pgn: string) => boolean;

  content: string[];
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
  const possibleBarks = barks
    .filter((b) => {
      const editedString = b.fn
        .replace(/move/g, "this.move")
        .replace(/prev/g, "this.prev")
        .replace(/history/g, "this.history")
        .replace(/pgn/g, "this.pgn");
      return wrappedEval(editedString, {
        move: history[0],
        prev: history[1] || {},
        history,
        pgn: game.pgn(),
      });
    })
    .map((b) => b.content)
    .flat();

  console.log(possibleBarks);
  if (possibleBarks.length > 0) return sample(possibleBarks);
}

const barks: Bark[] = [];

import rawBarks from "bundle-text:./barks.txt";
const lines = rawBarks.split("\n");
let currentBark: Bark | undefined;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].length > 0 && lines[i][0] !== "-") {
    if (currentBark) {
      barks.push(currentBark);
    }

    currentBark = {
      fn: lines[i],
      content: [],
    };
  } else if (lines[i].length > 0 && lines[i][0] === "-") {
    if (!currentBark) console.log("SYNTAX ERROR in file");
    currentBark?.content.push(lines[i].substring(2));
  }
}
