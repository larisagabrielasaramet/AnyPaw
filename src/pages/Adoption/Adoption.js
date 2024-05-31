import React, { useEffect, useState } from "react";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

import AdoptionCard from "./AdoptionCard";
import styles from "./Adoption.module.css";
import { Link } from "react-router-dom";

const Adoption = () => {
  const [adoptions, setAdoptions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setCurrentUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAdoptions = async () => {
      const adoptionsCollection = collection(FIREBASE_DB, "adoption");
      const adoptionsSnapshot = await getDocs(adoptionsCollection);
      const adoptionsList = await Promise.all(
        adoptionsSnapshot.docs.map(async (adoptionDoc) => {
          const adoption = adoptionDoc.data();
          console.log("adoption:", adoption);
          let userName = "";
          if (adoption.userId) {
            const userSnapshot = await getDoc(
              doc(FIREBASE_DB, "user", adoption.userId)
            );
            const user = userSnapshot.data();
            console.log("user:", user);
            userName = user ? user.fullname : "";
          }
          return { ...adoption, userName };
        })
      );
      setAdoptions(adoptionsList);
    };

    fetchAdoptions();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.motto}>
        <h3>Adopt today and change a life forever.</h3>
        <Link to={currentUser ? "/form" : "/signin"}>
          <button className={styles.adopt_button}>Add New Adoption</button>
        </Link>
      </div>
      <div className={styles.adoption_cards_container}>
        {adoptions.map((adoption) => (
          <AdoptionCard key={adoption.id} adoption={adoption} />
        ))}
      </div>
    </div>
  );
};

export default Adoption;
