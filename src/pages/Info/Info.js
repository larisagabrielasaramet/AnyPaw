import styles from "./Info.module.css";
import {
  FiMap,
  FiCalendar,
  FiPhone,
  FiMail,
  FiHome,
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiYoutube,
} from "react-icons/fi";
function Info() {
  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <h2>
          <FiMap className={styles.icon} />
          Where?
        </h2>
        <p>
          <FiHome className={styles.p_icon} />
          Strada Carei, nr.13, Timisoara, Romania
        </p>
        <iframe
          title="map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2782.7885635603566!2d21.215843612058798!3d45.77542747096019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474567959f7f5aa9%3A0xf8c0447e747155c8!2sStrada%20Carei%2013%2C%20Timi%C8%99oara%20300254!5e0!3m2!1sro!2sro!4v1715927940748!5m2!1sro!2sro"
          width="550"
          height="430"
          style={{ border: "0" }}
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <div className={`${styles.column} ${styles.schedule}`}>
        <h2>
          <FiCalendar className={styles.icon} />
          When?
        </h2>
        <p>▫️ Monday-Friday: 9AM-7PM</p>
        <p>▫️ Saturday: 9PM-2AM</p>
        <p>▫️ Sunday: closed</p>
      </div>

      <div className={`${styles.column} ${styles.contact}`}>
        <h2>
          <FiPhone className={styles.icon} />
          How?
        </h2>
        <p>
          <FiPhone className={styles.p_icon} />
          Phone: +4075388396
        </p>
        <p>
          <FiMail className={styles.p_icon} />
          Email: anypaw@vet.ro
        </p>
        <div>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles["facebook_icon"]}
          >
            <FiFacebook className={styles.social_icon} />
            Facebook
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            <FiTwitter className={styles.social_icon} />
            Twitter
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            <FiInstagram className={styles.social_icon} />
            Instagram
          </a>
          <a
            href="https://web.whatsapp.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FiYoutube className={styles.social_icon} />
            Youtube
          </a>
        </div>
      </div>
    </div>
  );
}

export default Info;
