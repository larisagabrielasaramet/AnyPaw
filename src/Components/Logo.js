import React from "react";
import logo from "./logoB.svg";
function Logo() {
  return (
    <div style={{ position: "absolute", top: 12, left: 120 }}>
      <img
        src={logo}
        alt="Logo"
        style={{
          width: "220px",
          height: "60px",
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
}

export default Logo;
