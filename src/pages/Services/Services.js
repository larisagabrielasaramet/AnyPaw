import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { FIREBASE_DB, FIREBASE_AUTH as auth } from "../../firebase/firebase";
import styles from "./Services.module.css";
import ServiceCard from "./ServiceCard";

const Services = () => {
  const [services, setServices] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      const servicesCollection = collection(FIREBASE_DB, "services");
      const servicesSnapshot = await getDocs(servicesCollection);
      const servicesList = servicesSnapshot.docs.map((doc) => doc.data());
      setServices(servicesList);
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.servicesContainer}>
      {services.map((service, index) => (
        <ServiceCard
          key={index}
          service={service}
          isAuthenticated={currentUser !== null}
        />
      ))}
    </div>
  );
};

export default Services;
