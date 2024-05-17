import React from "react";
import styles from "./DoctorCard.module.css";

const DoctorCard = ({ doctor }) => (
  <div className={styles.container}>
    <div className={styles.card}>
      <br></br>
      <div className={styles.column}>
        <h2>{doctor.fullname}</h2>
        <div className={styles.details}>
          <p className={styles.bold_text}>
            <span className={styles.span}>Quote:</span> {doctor.quote}
          </p>
          <p className={styles.bold_text}>
            <span className={styles.span}>Specialization:</span>{" "}
            {doctor.specialization}
          </p>
          <p className={styles.bold_text}>
            <span className={styles.span}>Age:</span> {doctor.age}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default DoctorCard;
