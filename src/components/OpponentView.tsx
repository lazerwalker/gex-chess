import React from "react";

import Lady from "../../libraries/pixel-ladies-free/003.png";

export default function () {
  return (
    <div>
      <div
        style={{
          backgroundImage: `url("${Lady}")`,
          boxSizing: "border-box",
          imageRendering: "pixelated",
          width: "80px",
          height: "80px",
          backgroundSize: "contain",
          marginBottom: "30px",
          float: "left",
          display: "inline-block",
        }}
      />
      <div
        style={{
          boxSizing: "border-box",
          color: "#7C3F58",
          fontFamily: "'BirdSeed', sans-serif",
          paddingLeft: "10px",
          paddingTop: "10px",
          width: "240px",
          float: "left",
          display: "inline-block",
        }}
      >
        You sunk my battleship!
        <br />
        Tee hee...
      </div>
    </div>
  );
}
