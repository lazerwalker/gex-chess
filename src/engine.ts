type ChessEvent = "bestmove" | "score";

export interface Engine {
  addEventListener: (event: ChessEvent, handler: Function) => void;
  makeMove: (fen: string) => void;
  newGame: () => void;
}

// TODO: Allow this to queue actions, and not export an async object
export default async function (): Promise<Engine> {
  // If we just use `new Worker(url)`, Parcel complains we need to pass in a URL object
  // If we actually Parcel-ify it, it fails to compile Stockfish because of the ndoe.js paths that are never hit
  // This silly workaround works, but means we can't use Parcel's nice module resolution
  // TODO: This won't scale to an offline mobile app
  const floop = Worker;
  const engine = new floop("./stockfish.js");

  engine.postMessage("uci");

  function makeMove(fen: string) {
    const message = `position fen ${fen}`;
    engine.postMessage(message);

    // TODO: Chessboardjsx has a much more complex relationship to time
    engine.postMessage("go movetime 1000");
  }

  function parseBestMove(line) {
    var match = line.match(
      /bestmove\s([a-h][1-8][a-h][1-8])(n|N|b|B|r|R|q|Q)?/
    );
    if (match) {
      var bestMove = match[1];
      var promotion = match[2];
      return {
        from: bestMove.substring(0, 2),
        to: bestMove.substring(2, 4),
        promotion: promotion,
      };
    }
  }

  function newGame() {
    engine.postMessage("ucinewgame");
  }

  engine.onmessage = function (event) {
    var line = event.data;
    // console.log("ENGINE: " + line);
    const bestMove = parseBestMove(line);
    if (bestMove) {
      handlers["bestmove"].forEach((fn) => fn(bestMove));
    }
  };

  const handlers: { [event in ChessEvent]: Function[] } = {
    bestmove: [],
    score: [],
  };

  // TODO: Try to make Handler fn type dependent on event type
  function addEventListener(event: ChessEvent, handler: Function) {
    handlers[event].push(handler);
  }

  return { addEventListener, makeMove, newGame };
}

/*

  let engineStatus = {};
  let time = { wtime: 3000, btime: 3000, winc: 1500, binc: 1500 };
  let playerColor = "black";
  let clockTimeoutID = null;
  // let isEngineRunning = false;
  let announced_game_over;
  // do not pick up pieces if the game is over
  // only pick up pieces for White

  setInterval(function () {
    if (announced_game_over) {
      return;
    }

    if (game.isGameOver()) {
      announced_game_over = true;
    }
  }, 500);

  function uciCmd(cmd) {
    // console.log('UCI: ' + cmd);

    engine.postMessage(cmd);
  }
  uciCmd("uci");

  function clockTick() {
    let t =
      (time.clockColor === "white" ? time.wtime : time.btime) +
      time.startTime -
      Date.now();
    let timeToNextSecond = (t % 1000) + 1;
    clockTimeoutID = setTimeout(clockTick, timeToNextSecond);
  }

  function stopClock() {
    if (clockTimeoutID !== null) {
      clearTimeout(clockTimeoutID);
      clockTimeoutID = null;
    }
    if (time.startTime > 0) {
      let elapsed = Date.now() - time.startTime;
      time.startTime = null;
      if (time.clockColor === "white") {
        time.wtime = Math.max(0, time.wtime - elapsed);
      } else {
        time.btime = Math.max(0, time.btime - elapsed);
      }
    }
  }

  function startClock() {
    if (game.turn() === "w") {
      time.wtime += time.winc;
      time.clockColor = "white";
    } else {
      time.btime += time.binc;
      time.clockColor = "black";
    }
    time.startTime = Date.now();
    clockTick();
  }

  function get_moves() {
    let moves = "";
    let history = game.history({ verbose: true });

    for (let i = 0; i < history.length; ++i) {
      let move = history[i];
      moves +=
        " " + move.from + move.to + (move.promotion ? move.promotion : "");
    }

    return moves;
  }

  const prepareMove = () => {
    stopClock();
    // this.setState({ fen: game.fen() });
    let turn = game.turn() === "w" ? "white" : "black";
    if (!game.isGameOver()) {
      // if (turn === playerColor) {
      if (turn !== playerColor) {
        // playerColor = playerColor === 'white' ? 'black' : 'white';
        uciCmd("position startpos moves" + get_moves());
        // uciCmd("position startpos moves" + get_moves(), evaler);
        // uciCmd("eval", evaler);

        if (time && time.wtime) {
          uciCmd(
            "go " +
              (time.depth ? "depth " + time.depth : "") +
              " wtime " +
              time.wtime +
              " winc " +
              time.winc +
              " btime " +
              time.btime +
              " binc " +
              time.binc
          );
        } else {
          uciCmd("go " + (time.depth ? "depth " + time.depth : ""));
        }
        // isEngineRunning = true;
      }
      if (game.history().length >= 2 && !time.depth && !time.nodes) {
        startClock();
      }
    }
  };

  engine.onmessage = (event) => {
    let line;

    if (event && typeof event === "object") {
      line = event.data;
    } else {
      line = event;
    }
    // console.log('Reply: ' + line);
    if (line === "uciok") {
      engineStatus.engineLoaded = true;
    } else if (line === "readyok") {
      engineStatus.engineReady = true;
    } else {
      let match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
      /// Did the AI move?
      if (match) {
        // isEngineRunning = false;
        game.move({ from: match[1], to: match[2], promotion: match[3] });
        this.setState({ fen: game.fen() });
        prepareMove();
        //uciCmd("eval");
        /// Is it sending feedback?
      } else if ((match = line.match(/^info .*\bdepth (\d+) .*\bnps (\d+)/))) {
        engineStatus.search = "Depth: " + match[1] + " Nps: " + match[2];
      }

      /// Is it sending feed back with a score?
      if ((match = line.match(/^info .*\bscore (\w+) (-?\d+)/))) {
        let score = parseInt(match[2], 10) * (game.turn() === "w" ? 1 : -1);
        /// Is it measuring in centipawns?
        if (match[1] === "cp") {
          engineStatus.score = (score / 100.0).toFixed(2);
          /// Did it find a mate?
        } else if (match[1] === "mate") {
          engineStatus.score = "Mate in " + Math.abs(score);
        }

        /// Is the score bounded?
        if ((match = line.match(/\b(upper|lower)bound\b/))) {
          engineStatus.score =
            ((match[1] === "upper") === (game.turn() === "w") ? "<= " : ">= ") +
            engineStatus.score;
        }
      }
    }
    // displayStatus();
  };

  return {
    start: function () {
      uciCmd("ucinewgame");
      uciCmd("isready");
      engineStatus.engineReady = false;
      engineStatus.search = null;
      prepareMove();
      announced_game_over = false;
    },
    prepareMove: function () {
      prepareMove();
    },
  };
}
*/
