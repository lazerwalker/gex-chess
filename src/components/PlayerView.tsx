import React from "react";

import Gex from "../../libraries/gex.png";

export default function (props: { bark?: string }) {
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
          color: "#7C3F58", //00B002
          fontFamily: "'BirdSeed', sans-serif",
          paddingRight: "10px",
          paddingTop: "30px",
          width: "200px",
          textAlign: "right",
          float: "right",
          display: "inline-block",
        }}
      >
        {props.bark}
      </div>
    </div>
  );
}
