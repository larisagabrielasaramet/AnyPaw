import React, { useState, useEffect } from "react";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import styles from "./DoctorProfile.module.css";

const DoctorProfile = () => {
  const [doctorData, setDoctorData] = useState(null);

  const getDoctorData = async (uid) => {
    if (!uid) {
      console.log("No user ID provided");
      return null;
    }
    const q = query(collection(FIREBASE_DB, "user"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      console.log("User document data:", querySnapshot.docs[0].data());
      return querySnapshot.docs[0].data();
    } else {
      console.log("No user document found");
      return null;
    }
  };

  useEffect(() => {
    const fetchDoctorData = async () => {
      const uid = FIREBASE_AUTH.currentUser
        ? FIREBASE_AUTH.currentUser.uid
        : null;
      console.log("Current user ID:", uid);
      if (uid) {
        const data = await getDoctorData(uid);
        console.log("Fetched data:", data);
        setDoctorData(data);
      }
    };

    fetchDoctorData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <h1> {doctorData?.fullName}</h1>
        <p>
          <strong>Email:</strong> {doctorData?.email}
        </p>
        <p>
          <strong>Specialty:</strong> {doctorData?.speciality}
        </p>
        <p>
          <strong>Address:</strong> {doctorData?.address}
        </p>
      </div>
    </div>
  );
};

export default DoctorProfile;
