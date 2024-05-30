import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebase/firebase";
import Navbar from "../Homepage/NavBarDoc";
import styles from "./MedicalHistoryPage.module.css";

function MedicalHistoryPage() {
  const { petId } = useParams();
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [petData, setPetData] = useState({});
  const [userData, setUserData] = useState({});
  const [newEntry, setNewEntry] = useState("");

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
          setUserData(userDocSnapshot.data());
        } else {
          console.log("No such user document!");
        }
      } else {
        console.log("No such pet document!");
      }
    };

    fetchMedicalHistory();
  }, [petId]);

  const handleNewEntryChange = (event) => {
    setNewEntry(event.target.value);
  };

  const handleNewEntrySubmit = async (event) => {
    event.preventDefault();
    const petDoc = doc(FIREBASE_DB, "pet", petId);
    await updateDoc(petDoc, {
      entry: arrayUnion(newEntry),
    });
    setMedicalHistory((prev) => [...prev, newEntry]);
    setNewEntry("");
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.card}>
        <h1 className={styles.title}>Medical History</h1>
        <h2 className={styles.subtitle}>Pet Details</h2>
        <p className={styles.details}>ID: {petId}</p>
        <p className={styles.details}>Sex: {petData.sex}</p>
        <p className={styles.details}>Type: {petData.type}</p>
        <p className={styles.details}>Weight: {petData.weight}</p>
        <form onSubmit={handleNewEntrySubmit} className={styles.form}>
          <input
            type="text"
            value={newEntry}
            onChange={handleNewEntryChange}
            placeholder="Add new medical entry"
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Add
          </button>
        </form>
        <ul className={styles.list}>
          {medicalHistory.map((entry, index) => (
            <li key={index} className={styles.listItem}>
              {entry}
            </li>
          ))}
        </ul>
        <h2 className={styles.subtitle}>Owner Details</h2>
        <p className={styles.details}>Name: {userData.fullName}</p>
        <p className={styles.details}>Phone: {userData.phone}</p>
        <p className={styles.details}>Email: {userData.email}</p>
      </div>
    </div>
  );
}

export default MedicalHistoryPage;
