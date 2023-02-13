import React from "react";

import Lady from "../../libraries/pixel-ladies-free/003.png";

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
          backgroundImage: `url("${Lady}")`,
          boxSizing: "border-box",
          // border: "2px solid #7C3F58",
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
        {props.bark}
      </div>
    </div>
  );
}
