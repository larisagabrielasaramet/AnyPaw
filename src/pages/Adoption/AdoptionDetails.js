import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "@firebase/firestore";
import { FIREBASE_DB } from "../../firebase/firebase";
import styles from "./AdoptionDetails.module.css";
import Modal from "react-modal";
import Draggable from "react-draggable";

Modal.setAppElement("#root");

const AdoptionDetails = () => {
  const { title } = useParams();
  const [adoption, setAdoption] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    const fetchAdoptionDetails = async () => {
      const adoptionCollection = collection(FIREBASE_DB, "adoption");
      const q = query(adoptionCollection, where("title", "==", title));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setAdoption(querySnapshot.docs[0].data());
      } else {
        console.log("No such document!");
      }
    };

    fetchAdoptionDetails();
  }, [title]);

  if (!adoption) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.adoptionDetailsContainer}>
      <div className={styles.card}>
        <h2>{adoption.title}</h2>
        <p>
          <span style={{ fontWeight: "bold" }}>Breed:</span> {adoption.race}
        </p>
        <p>
          <span style={{ fontWeight: "bold" }}>Date of Birth:</span>{" "}
          {adoption.age}
        </p>
        <p>
          <span style={{ fontWeight: "bold" }}>Description:</span>{" "}
          {adoption.description}
        </p>
        <p>
          <span style={{ fontWeight: "bold" }}>Address:</span>{" "}
          {adoption.address}
        </p>
        <p>
          <span style={{ fontWeight: "bold" }}>Phone:</span> {adoption.phone}
        </p>
        <div className={styles.images}>
          {adoption.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Adoption ${index}`}
              onClick={() => openModal(image)}
            />
          ))}
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Image Modal"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.75)",
            },
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "auto",
              backgroundColor: "transparent",
              border: "none",
            },
          }}
        >
          <Draggable>
            <img
              src={selectedImage}
              alt="Selected"
              style={{ width: "600px", height: "600px", objectFit: "contain" }}
            />
          </Draggable>
        </Modal>
      </div>
    </div>
  );
};

export default AdoptionDetails;
