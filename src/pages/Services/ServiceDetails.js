import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";

import { FIREBASE_DB } from "../../firebase/firebase";
import styles from "./ServiceDetails.module.css";

const ServiceDetails = () => {
  const { title } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      const servicesCollection = collection(FIREBASE_DB, "services");
      const q = query(servicesCollection, where("title", "==", title));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setService(querySnapshot.docs[0].data());
      } else {
        console.log("No such document!");
      }
    };

    fetchServiceDetails();
  }, [title]);

  if (!service) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.serviceDetailsContainer}>
      <div className={styles.card}>
        <h2>{service.title}</h2>
        <p>{service.description}</p>
        <p>Services:</p>
        <ul>
          {service.services.map((service, index) => (
            <li key={index}>{service}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServiceDetails;
