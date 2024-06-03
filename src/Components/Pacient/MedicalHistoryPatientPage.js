import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/firebase";
import PatientNavbar from "./PatientNavBar";
import styles from "./MedicalHistoryPatientPage.module.css";

function MedicalHistoryPage() {
  const { petId } = useParams();
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [petData, setPetData] = useState({});
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      const petDoc = doc(FIREBASE_DB, "pet", petId);
      const petDocSnapshot = await getDoc(petDoc);
      if (petDocSnapshot.exists()) {
        const petData = petDocSnapshot.data();
        setMedicalHistory(petData.entry);
        setPetData(petData);
        const userDoc = doc(FIREBASE_DB, "user", petData.userId);
        const userDocSnapshot = await getDoc(userDoc);
        if (userDocSnapshot.exists()) {
          const currentUserData = userDocSnapshot.data();
          setUserData(currentUserData);
        } else {
          console.log("No such user document!");
        }
      } else {
        console.log("No such pet document!");
      }
    };

    fetchMedicalHistory();
  }, [petId]);

  return (
    <div className={styles.container}>
      <PatientNavbar />
      <div className={styles.card}>
        <h1 className={styles.title}>{petData.name}</h1>
        <div className={styles.detailsContainer}>
          <div className={styles.petDetails}>
            <h2 className={styles.subtitle}>Pet Details</h2>
            <p className={styles.details}>
              <strong>ID:</strong> {petId}
            </p>
            <p className={styles.details}>
              <strong>Sex:</strong> {petData.sex}
            </p>
            <p className={styles.details}>
              <strong>Type: </strong> {petData.type}
            </p>
            <p className={styles.details}>
              <strong>Weight:</strong> {petData.weight}
            </p>
          </div>
          <div className={styles.ownerDetails}>
            <h2 className={styles.subtitle}>Owner Details</h2>
            <p className={styles.details}>
              <strong>Name:</strong> {userData.fullName}
            </p>
            <p className={styles.details}>
              <strong>Phone:</strong> {userData.phone}
            </p>
            <p className={styles.details}>
              <strong>Email: </strong> {userData.email}
            </p>
          </div>
        </div>
        <h2 className={styles.subtitleHistory}>Medical History:</h2>
        <ul className={styles.list}>
          {Array.isArray(medicalHistory) ? (
            medicalHistory.map((entry) => <li>{entry}</li>)
          ) : (
            <p></p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default MedicalHistoryPage;
