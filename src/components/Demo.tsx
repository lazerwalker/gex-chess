import React, { Component } from "react";

import PlayableChessBoard from "./GameView";

class Demo extends Component {
  render() {
    return (
      <div>
        <div style={boardsContainer}>
          <PlayableChessBoard w="ai" b="ai" />
        </div>
      </div>
    );
  }
}

export default Demo;

const boardsContainer = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  flexWrap: "wrap",
  width: "100vw",
  marginTop: 30,
  marginBottom: 50,
};
