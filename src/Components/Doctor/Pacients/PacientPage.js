import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebase/firebase";
import styles from "./PacientPage.module.css";
import { useNavigate } from "react-router-dom";
import AddPetForm from "./AddPetForm.js";
import SearchBar from "./SearchBar.js";
import dogic from "./dogic.svg";

function PacientPage() {
  const [patients, setPatients] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const fetchPatients = async () => {
    const patientsCollection = collection(FIREBASE_DB, "pet");
    const patientSnapshot = await getDocs(patientsCollection);

    const patientList = patientSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setPatients(patientList);
  };

  useEffect(() => {
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

  const handleAddPet = async (pet) => {
    const petsCollection = collection(FIREBASE_DB, "pet");
    await addDoc(petsCollection, pet);
    setShowForm(false);
    fetchPatients();
  };
  const handleHistoryClick = (id) => {
    fetchMedicalHistory(id);
    navigate(`/doctor/patients/${id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.emptyElement}>
        <img src={dogic} alt="dogic" className={styles.dogic} />
        <button
          className={styles.addPetButton}
          onClick={() => setShowForm(true)}
        >
          Add New Patient
        </button>
        <div className={styles.containerSerach}>
          <SearchBar
            pets={patients}
            handleHistoryClick={handleHistoryClick}
            medicalHistory={medicalHistory}
          />
        </div>
      </div>
      {showForm && <AddPetForm onAddPet={handleAddPet} />}{" "}
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
