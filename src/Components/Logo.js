import React from "react";
import logo from "../Assets/logo.png";
function Logo() {
  return (
    <div>
      <img
        src={logo}
        alt="Logo"
        style={{
          width: "150px",
          height: "150px",
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
}

export default Logo;
