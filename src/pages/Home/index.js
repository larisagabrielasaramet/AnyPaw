import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebase/firebase";
import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  const title = "Welcome to AnyPaw!";
  const letters = title.split("").map((letter, index) => (
    <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
      {letter}
    </span>
  ));

  const openForm = () => {
    window.open("https://zqfp4mlm.forms.app/application-form", "_blank");
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);
  const handleAppointmentClick = () => {
    if (!currentUser) {
      navigate("/signin");
    } else {
      navigate("/patient/appointments");
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://forms.app/static/embed.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
          onClick={handleAppointmentClick}
        >
          Make an appointment
        </button>
        <button onClick={openForm} className={styles.custom_button}>
          Join our team
        </button>
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
