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
import { onAuthStateChanged } from "firebase/auth";
import styles from "./DoctorProfile.module.css";
import personalInfo from "./personalInfo.svg";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
const DoctorProfile = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newData, setNewData] = useState({});
  const [docId, setDocId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

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
      setDocId(teamQuerySnapshot.docs[0].id);
    } else {
      console.log("No team document found");
    }
    return teamData;
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("Current user ID:", uid);
        fetchDoctorData(uid);
      } else {
        console.log("No user is currently logged in");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchDoctorData = async (uid) => {
    const data = await getDoctorData(uid);
    console.log("Fetched data:", data);
    if (data === null) {
      console.log("getDoctorData returned null");
    } else {
      setDoctorData(data);
    }
  };
  const handleInputChange = (event) => {
    setNewData({ ...newData, [event.target.name]: event.target.value });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const storage = getStorage();
    const storageRef = ref(storage, "images/" + file.name);

    setNewData({
      ...newData,
      imageUrl: URL.createObjectURL(file),
    });

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setNewData({
            ...newData,
            imageUrl: downloadURL,
          });
        });
      }
    );
  };
  const handleEditClick = async () => {
    if (isEditing) {
      const updatedData = {
        ...doctorData,
        ...newData,
      };
      setDoctorData(updatedData);
      const uid = FIREBASE_AUTH.currentUser
        ? FIREBASE_AUTH.currentUser.uid
        : null;
      if (uid && docId) {
        if (selectedFile) {
          const storage = getStorage();
          const storageRef = ref(storage, "images/" + selectedFile.name);

          const uploadTask = uploadBytesResumable(storageRef, selectedFile);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
              console.error("Error uploading file: ", error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                updatedData.imageUrl = downloadURL;

                updateDocument(uid, docId, updatedData);
              });
            }
          );
        } else {
          updateDocument(uid, docId, updatedData);
        }
      }

      setNewData({});
    }

    setIsEditing(!isEditing);
  };

  const updateDocument = async (uid, docId, updatedData) => {
    try {
      await setDoc(doc(collection(FIREBASE_DB, "team"), docId), updatedData);
      console.log("Document updated successfully");
    } catch (e) {
      console.error("Error updating document: ", e);
    }
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
