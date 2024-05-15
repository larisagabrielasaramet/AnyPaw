// pages/index.js

import React from "react";

import styles from "./Home.module.css";

const Home = () => {
  const title = "Welcome to AnyPaw!";
  const letters = title.split("").map((letter, index) => (
    <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
      {letter}
    </span>
  ));
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{letters}</h2>
      <p className={styles.subtitle}>
        Where compassion meets care: Your trusted partner in pet health!
      </p>
      <div className={styles.schedule}>
        <h2>SCHEDULE</h2>
        <p>Mon-Fri: 9AM-7PM</p>
        <p>Sat/Sun: CLOSED</p>
        <button
          className={styles.button}
          onClick={() => alert("Make an appointment")}
        >
          Make an appointment
        </button>
      </div>
      <div className={styles.contact}>
        <h2>Contact Us</h2>
        <p className={styles}>Phone: +40.75388396 - Email: anypaw@vet.ro</p>
      </div>
      <div className={styles.footer}>
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles["facebook_icon"]}
        ></a>
        <a
          href="https://www.twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles["twitter_icon"]}
        ></a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles["instagram_icon"]}
        ></a>
      </div>
    </div>
  );
};

export default Home;
