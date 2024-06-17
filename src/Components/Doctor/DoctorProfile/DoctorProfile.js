import React, { useState, useEffect } from "react";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import styles from "./DoctorProfile.module.css";
import personalInfo from "./personalInfo.svg";

const DoctorProfile = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newData, setNewData] = useState({});

  const getDoctorData = async (uid) => {
    if (!uid) {
      console.log("No user ID provided");
      return null;
    }
    const teamQuery = query(
      collection(FIREBASE_DB, "team"),
      where("userId", "==", uid)
    );
    const teamQuerySnapshot = await getDocs(teamQuery);
    let teamData = null;
    if (!teamQuerySnapshot.empty) {
      console.log("Team document data:", teamQuerySnapshot.docs[0].data());
      teamData = teamQuerySnapshot.docs[0].data();
    } else {
      console.log("No team document found");
    }
    return teamData;
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
        if (data === null) {
          console.log("getDoctorData returned null");
        } else {
          setDoctorData(data);
        }
      } else {
        console.log("No user is currently logged in");
      }
    };

    fetchDoctorData();
  }, []);
  const handleInputChange = (event) => {
    setNewData({ ...newData, [event.target.name]: event.target.value });
  };

  const handleImageChange = (event) => {
    setNewData({
      ...newData,
      imageUrl: URL.createObjectURL(event.target.files[0]),
    });
  };

  const handleEditClick = async () => {
    if (isEditing) {
      setDoctorData({ ...doctorData, ...newData });
      const uid = FIREBASE_AUTH.currentUser
        ? FIREBASE_AUTH.currentUser.uid
        : null;
      if (uid) {
        const docRef = doc(FIREBASE_DB, "team", uid);
        await setDoc(docRef, { ...doctorData, ...newData }, { merge: true });
      }
      setNewData({});
    }
    setIsEditing(!isEditing);
  };

  return (
    <div>
      <img src={personalInfo} alt="info" className={styles.logo}></img>
      <div className={styles.card}>
        {isEditing ? (
          <input type="file" accept="image/*" onChange={handleImageChange} />
        ) : (
          <img
            src={doctorData?.imageUrl}
            alt="Doctor"
            className={styles.doctorImage}
          />
        )}

        {isEditing ? (
          <input
            type="text"
            name="fullname"
            defaultValue={doctorData?.fullname}
            onChange={handleInputChange}
            className={styles.inputField}
          />
        ) : (
          <h1 className={styles.title}>{doctorData?.fullname}</h1>
        )}

        {isEditing ? (
          <input
            type="text"
            name="age"
            defaultValue={doctorData?.age}
            onChange={handleInputChange}
            className={styles.inputField}
          />
        ) : (
          <p className={styles.details}>
            <strong>Age:</strong> {doctorData?.age}
          </p>
        )}

        {isEditing ? (
          <input
            type="text"
            name="specialization"
            defaultValue={doctorData?.specialization}
            onChange={handleInputChange}
            className={styles.inputField}
          />
        ) : (
          <p className={styles.details}>
            <strong>Specialization:</strong> {doctorData?.specialization}
          </p>
        )}

        {isEditing ? (
          <input
            type="text"
            name="quote"
            defaultValue={doctorData?.quote}
            onChange={handleInputChange}
            className={styles.inputField}
          />
        ) : (
          <p className={styles.details}>
            <strong>Quote:</strong> {doctorData?.quote}
          </p>
        )}

        <button className={styles.buttons} onClick={handleEditClick}>
          {isEditing ? "Save" : "Edit profile"}
        </button>
      </div>
    </div>
  );
};

export default DoctorProfile;
