import React, { useState, useEffect } from "react";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import styles from "./DoctorPage.module.css";

const DoctorPage = () => {
  const [doctorName, setDoctorName] = useState("");

  const getDoctorName = async (uid) => {
    if (!uid) {
      console.log("No user ID provided");
      return null;
    }
    const q = query(collection(FIREBASE_DB, "user"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      console.log("User document data:", querySnapshot.docs[0].data());
      return querySnapshot.docs[0].data().fullName;
    } else {
      console.log("No user document found");
      return null;
    }
  };

  useEffect(() => {
    const fetchDoctorName = async () => {
      const uid = FIREBASE_AUTH.currentUser
        ? FIREBASE_AUTH.currentUser.uid
        : null;
      console.log("Current user ID:", uid);
      if (uid) {
        const name = await getDoctorName(uid);
        console.log("Fetched name:", name);
        setDoctorName(name);
      }
    };

    fetchDoctorName();
  }, []);

  return (
    <div className={styles.doctor_page}>
      <h1>Welcome, dr. {doctorName}!</h1>
      <p>We're glad to have you here. Have a great day!</p>
    </div>
  );
};

export default DoctorPage;
