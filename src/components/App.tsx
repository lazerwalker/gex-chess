import React, { Component } from "react";

import PlayableChessBoard from "./GameView";
import OpponentView from "./OpponentView";
import PlayerView from "./PlayerView";

class App extends Component {
  render() {
    return (
      <div>
        <div style={boardsContainer}>
          <OpponentView />
          <PlayableChessBoard w="human" b="human" />
          <PlayerView />
        </div>
      </div>
    );
  }
}

export default App;

const boardsContainer = {
  width: "320px",
  margin: "auto",
  marginTop: 30,
  marginBottom: 50,
};
