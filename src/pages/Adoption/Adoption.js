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

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAdoptions = async () => {
      const adoptionsCollection = collection(FIREBASE_DB, "adoption");
      const adoptionsSnapshot = await getDocs(adoptionsCollection);
      let adoptionsList = await Promise.all(
        adoptionsSnapshot.docs.map(async (adoptionDoc) => {
          const adoption = adoptionDoc.data();
          let userName = "";
          if (adoption.userId) {
            const userSnapshot = await getDoc(
              doc(FIREBASE_DB, "user", adoption.userId)
            );
            const user = userSnapshot.data();
            userName = user ? user.fullname : "";
          }
          return { ...adoption, userName };
        })
      );
      adoptionsList = adoptionsList.sort((a, b) => {
        if (!b.createdAt || !a.createdAt) {
          return -1;
        }
        return b.createdAt.seconds - a.createdAt.seconds;
      });
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
