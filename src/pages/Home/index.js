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
      <div className={styles.paragraph}>
        <h2 className={styles.title}>{letters}</h2>
        <p className={styles.subtitle}>
          Where compassion meets care: Your trusted partner in pet health!
        </p>
      </div>
      <div className={styles.services_buttons}>
        <button
          className={styles.custom_button}
          onClick={() => (window.location.href = "/signin")}
        >
          Make an appointment
        </button>
        <button class={styles.custom_button}>Join our team</button>
      </div>
      <div className={styles.footer}>
        <p>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles["facebook_icon"]}
          >
            Facebook
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles["twitter_icon"]}
          >
            Twitter
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles["instagram_icon"]}
          >
            Instagram
          </a>
        </p>
      </div>
    </div>
  );
};

export default Home;
