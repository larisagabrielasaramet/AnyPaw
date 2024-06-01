import React, { useState } from "react";
import styles from "./ServiceCard.module.css";
import { Link } from "react-router-dom";

const ServiceCard = ({ service, isAuthenticated }) => {
  const [showMore] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img
          src={service.logoUrl}
          alt={service.title}
          className={styles.logo}
        />
        <div className={styles.column}>
          <h2>{service.title}</h2>
          <p>{service.cardDescription}</p>
          <Link
            to={
              isAuthenticated
                ? `/patient/services/${service.title}`
                : `/services/${service.title}`
            }
            className={styles.button}
          >
            More
          </Link>
          {showMore && (
            <div className={styles.details}>
              <p className={styles.bold_text}>
                <span className={styles.span}>Description:</span>{" "}
                {service.description}
              </p>
              <div className={styles.bold_text}>
                <span className={styles.span}>Services:</span>
                <ul className={styles.servicesList}>
                  {service.services.map((serviceItem, index) => (
                    <li key={index}>{serviceItem}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
