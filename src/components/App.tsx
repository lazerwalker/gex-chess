import React, { Component } from "react";

import PlayableChessBoard from "./GameView";

class App extends Component {
  render() {
    return (
      <div>
        <div style={boardsContainer}>
          <PlayableChessBoard w="human" b="human" />
        </div>
      </div>
    );
  }
}

export default App;

const boardsContainer = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  flexWrap: "wrap",
  width: "100vw",
  marginTop: 30,
  marginBottom: 50,
};
