import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../firebase/firebase";
import styles from "./PacientProfile.module.css";
import catic from "./catic.svg";

const PacientProfile = () => {
  const [pets, setPets] = useState([]);

  const navigate = useNavigate();

  const fetchPets = async () => {
    const uid = FIREBASE_AUTH.currentUser
      ? FIREBASE_AUTH.currentUser.uid
      : null;
    if (uid) {
      const userQuerySnapshot = await getDocs(
        query(collection(FIREBASE_DB, "user"), where("uid", "==", uid))
      );
      if (!userQuerySnapshot.empty) {
        const userDoc = userQuerySnapshot.docs[0];
        const userId = userDoc.id;
        const petQuerySnapshot = await getDocs(
          query(collection(FIREBASE_DB, "pet"), where("userId", "==", userId))
        );
        const data = petQuerySnapshot.docs.map((doc) => {
          const petData = doc.data();
          return {
            ...petData,
            id: doc.id,
          };
        });
        setPets(data);
      }
    }
  };
  const handleHistoryClick = (id) => {
    navigate(`/patient/profile/${id}`);
  };
  useEffect(() => {
    fetchPets();
  }, []);
  return (
    <div className={styles.container}>
      <img src={catic} alt="catic" className={styles.catic} />
      {pets.map((pet) => (
        <div key={pet.id} className={styles.patient_card}>
          <h2>{pet.name}</h2>
          <p>
            <strong>ID:</strong> {pet.id}
          </p>
          <p>
            <strong>Age:</strong> {pet.age}
          </p>
          <button onClick={() => handleHistoryClick(pet.id)}>
            Medical History
          </button>
        </div>
      ))}
    </div>
  );
};

export default PacientProfile;
