import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { getDocs, query, collection, where, addDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { FIREBASE_DB } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";
import styles from "./AdoptionForm.module.css";
import { useNavigate } from "react-router-dom";

const AdoptionForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const auth = getAuth();
  const [images, setImages] = useState([]);
  const [imageUrl, setCardImage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const q = query(
      collection(FIREBASE_DB, "user"),
      where("uid", "==", auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    const userId =
      querySnapshot.docs.length > 0
        ? querySnapshot.docs[0].id
        : auth.currentUser.uid;

    const newData = {
      ...data,
      userId: userId,
      images,
      imageUrl,
    };

    try {
      const docRef = await addDoc(collection(FIREBASE_DB, "adoption"), newData);
      console.log("Document written with ID: ", docRef.id);
      reset();
      setImages([]);
      setCardImage("");
      navigate("/patient/adoption");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleImageUpload = (event, setImage) => {
    const file = event.target.files[0];
    const storage = getStorage();
    const storageRef = ref(storage, "images/" + file.name);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImage(downloadURL);
        });
      }
    );
  };

  return (
    <div className={styles.adoption_formContainer}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.adoption_form}>
        <h3>
          <strong>Adoption Form</strong>
        </h3>
        <input {...register("title")} placeholder="Title" required />
        <input {...register("race")} placeholder="Race" required />
        <input {...register("sex")} placeholder="Sex" required />
        <input
          {...register("description")}
          placeholder="Description"
          required
        />
        <input {...register("phone")} placeholder="Phone" required />
        <input {...register("age")} placeholder="Date of birth" required />
        <input {...register("address")} placeholder="Address" required />
        <input
          type="file"
          onChange={(e) => handleImageUpload(e, setCardImage)}
          required
        />
        <input
          type="file"
          onChange={(e) =>
            handleImageUpload(e, (url) => setImages((prev) => [...prev, url]))
          }
          required
        />
        <input
          type="file"
          onChange={(e) =>
            handleImageUpload(e, (url) => setImages((prev) => [...prev, url]))
          }
          required
        />
        <input
          type="file"
          onChange={(e) =>
            handleImageUpload(e, (url) => setImages((prev) => [...prev, url]))
          }
          required
        />
        <input
          type="file"
          onChange={(e) =>
            handleImageUpload(e, (url) => setImages((prev) => [...prev, url]))
          }
          required
        />
        <input type="submit" />
      </form>
    </div>
  );
};

export default AdoptionForm;
