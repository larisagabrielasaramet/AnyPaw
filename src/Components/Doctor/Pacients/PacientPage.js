import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebase/firebase";
import styles from "./PacientPage.module.css";
import { useNavigate } from "react-router-dom";

function PacientPage() {
  const [patients, setPatients] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      const patientsCollection = collection(FIREBASE_DB, "pet");
      const patientSnapshot = await getDocs(patientsCollection);
      const patientList = patientSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPatients(patientList);
    };

    fetchPatients();
  }, []);

  const fetchMedicalHistory = async (petId) => {
    const medicalHistoryCollection = collection(FIREBASE_DB, "medicalHistory");
    const q = query(medicalHistoryCollection, where("petId", "==", petId));
    const medicalHistorySnapshot = await getDocs(q);
    const medicalHistoryList = medicalHistorySnapshot.docs.map(
      (doc) => doc.data().entry
    );
    setMedicalHistory(medicalHistoryList);
  };

  const handleHistoryClick = (id) => {
    fetchMedicalHistory(id);
    navigate(`/patient/${id}`);
  };

  return (
    <div className={styles.container}>
      {patients.map((patient) => (
        <div key={patient.id} className={styles.patient_card}>
          <h2>{patient.name}</h2>
          <p>
            <strong>ID:</strong> {patient.id}
          </p>
          <p>
            <strong>Breed:</strong> {patient.type}
          </p>
          <button onClick={() => handleHistoryClick(patient.id)}>
            Medical History
          </button>
          <ul>
            {medicalHistory.map((entry, index) => (
              <li key={index}>{entry}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default PacientPage;
