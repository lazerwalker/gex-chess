import { Chess } from "chess.js";
import { sample } from "lodash";

import gexBarkFile from "bundle-text:./gexBarks.txt";
import enemyBarkFile from "bundle-text:./enemyBarks.txt";

const gexBarks = generateBarks(gexBarkFile);
const enemyBarks = generateBarks(enemyBarkFile);

interface Bark {
  // Verbose history, reversed so 0 is most recent
  fn: string; //(move: Move, prev: Move, history: Move[], pgn: string) => boolean;

  content: string[];
}

export function generateGexBark(game: Chess) {
  return generateBark(gexBarks, game);
}

export function generateEnemyBark(game: Chess) {
  return generateBark(enemyBarks, game);
}

// *unhinged laughter*
function generateBark(barks: Bark[], game: Chess) {
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

function generateBarks(barkFile: string) {
  const barks: Bark[] = [];

  const lines = barkFile.split("\n");
  let currentBark: Bark | undefined;

  for (let i = 0; i < lines.length; i++) {
    console.log("Line: ", lines[i], lines[i].length);
    if (lines[i][0] === "#" || lines[i].length === 0) continue;

    if (lines[i][0] === "-") {
      if (!currentBark) console.log("SYNTAX ERROR in file");
      currentBark?.content.push(lines[i].substring(2));
    } else {
      if (currentBark) {
        barks.push(currentBark);
      }

      currentBark = {
        fn: lines[i],
        content: [],
      };
    }
  }
  if (currentBark) {
    barks.push(currentBark);
  }

  console.log(barks);
  return barks;
}
