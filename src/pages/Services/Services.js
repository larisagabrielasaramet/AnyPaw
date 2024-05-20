import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

import { FIREBASE_DB } from "../../firebase/firebase";
import styles from "./Services.module.css";
import ServiceCard from "./ServiceCard";

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      const servicesCollection = collection(FIREBASE_DB, "services");
      const servicesSnapshot = await getDocs(servicesCollection);
      const servicesList = servicesSnapshot.docs.map((doc) => doc.data());
      setServices(servicesList);
    };

    fetchServices();
  }, []);

  return (
    <div className={styles.servicesContainer}>
      <h1>Services</h1>
      {services.map((service, index) => (
        <ServiceCard key={index} service={service} />
      ))}
    </div>
  );
};

export default Services;
