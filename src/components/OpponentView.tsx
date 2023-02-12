import React from "react";

import Lady from "../../libraries/pixel-ladies-free/003.png";

export default function () {
  return (
    <div
      style={{
        marginBottom: "40px",
        marginTop: "20px",
        height: "120px",
      }}
    >
      <div
        style={{
          backgroundImage: `url("${Lady}")`,
          boxSizing: "border-box",
          imageRendering: "pixelated",
          width: "120px",
          height: "120px",
          backgroundSize: "contain",
          float: "left",
          display: "inline-block",
        }}
      />
      <div
        style={{
          boxSizing: "border-box",
          color: "#7C3F58",
          fontFamily: "'BirdSeed', sans-serif",
          paddingLeft: "5px",
          paddingTop: "10px",
          width: "200px",
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
