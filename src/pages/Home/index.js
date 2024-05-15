// pages/index.js

import React from "react";

import "./Home.css";

const Home = () => {
  return (
    <div className="container">
      <div className="schedule">
        <h2>Orar</h2>
        <p>Luni - Vineri: 9:00 - 17:00</p>
        <p>Sâmbătă: 10:00 - 14:00</p>
        <p>Duminică: Închis</p>
        <button className="button" onClick={() => alert("Make an appointment")}>
          Make an appointment
        </button>
      </div>
      <div className="footer">
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="facebook-icon"
        ></a>
        <a
          href="https://www.twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="twitter-icon"
        ></a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="instagram-icon"
        ></a>
      </div>
    </div>
  );
};

export default Home;
