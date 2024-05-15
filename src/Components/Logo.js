import React from "react";
import logo from "./logo.png";
function Logo() {
  return (
    <div style={{ position: "absolute", top: 3, left: 50 }}>
      <img
        src={logo}
        alt="Logo"
        style={{
          width: "auto",
          height: "60px",
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
}

export default Logo;
