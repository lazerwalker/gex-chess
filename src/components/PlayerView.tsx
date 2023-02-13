import React from "react";

import Gex from "../../libraries/gex.png";

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
          backgroundImage: `url("${Gex}")`,
          // border: "2px solid #7C3F58",
          boxSizing: "border-box",
          imageRendering: "pixelated",
          width: "120px",
          height: "120px",
          backgroundSize: "contain",
          float: "right",
          display: "inline-block",
        }}
      />
      <div
        style={{
          boxSizing: "border-box",
          color: "#7C3F58",
          fontFamily: "'BirdSeed', sans-serif",
          paddingRight: "10px",
          paddingTop: "30px",
          width: "200px",
          textAlign: "right",
          float: "right",
          display: "inline-block",
        }}
      >
        Never go in against a Sicilian when death is on the line!
      </div>
    </div>
  );
}
