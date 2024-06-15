import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebase/firebase";
import DoctorNavbar from "../Homepage/NavBarDoc";
import styles from "./MedicalHistoryPage.module.css";
import { FaEdit, FaTrash } from "react-icons/fa";

function MedicalHistoryPage() {
  const { petId } = useParams();
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [petData, setPetData] = useState({});
  const [userData, setUserData] = useState({});
  const [newEntry, setNewEntry] = useState([]);

  const handleDeleteEntry = async (index) => {
    const updatedHistory = medicalHistory.filter((_, i) => i !== index);
    const petDoc = doc(FIREBASE_DB, "pet", petId);
    await updateDoc(petDoc, {
      entry: updatedHistory,
    });
    setMedicalHistory(updatedHistory);
  };

  const handleEditEntry = (index) => {
    const entryToEdit = medicalHistory[index];
    setNewEntry(entryToEdit);
    handleDeleteEntry(index);
  };

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      const petDoc = doc(FIREBASE_DB, "pet", petId);
      const petDocSnapshot = await getDoc(petDoc);
      if (petDocSnapshot.exists()) {
        const petData = petDocSnapshot.data();
        if (Array.isArray(petData.entry)) {
          setMedicalHistory(petData.entry);
        } else {
          setMedicalHistory([petData.entry]);
        }
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
      <DoctorNavbar />
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
        <h2 className={styles.subtitle}>Medical History:</h2>
        <ul className={styles.list}>
          {medicalHistory
            ? medicalHistory.map((entry, index) => (
                <li key={index} className={styles.listItem}>
                  {entry}
                  <div className={styles.divider}>
                    <button
                      onClick={() => handleEditEntry(index)}
                      className={styles.button}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(index)}
                      className={styles.button}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))
            : null}
        </ul>

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
      </div>
    </div>
  );
}

export default MedicalHistoryPage;
