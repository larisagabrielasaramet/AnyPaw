import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/firebase";
import DoctorCard from "./DoctorCard";
import styles from "./Team.module.css";

const Teams = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const doctorsCollection = collection(FIREBASE_DB, "team");
      const doctorsSnapshot = await getDocs(doctorsCollection);
      const doctorsList = doctorsSnapshot.docs.map((doc) => doc.data());
      setDoctors(doctorsList);
    };

    fetchDoctors();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Team</h1>
      {doctors.map((doctor, index) => (
        <DoctorCard key={index} doctor={doctor} />
      ))}
    </div>
  );
};

export default Teams;
