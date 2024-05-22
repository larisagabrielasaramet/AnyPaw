import { getFirestore, collection, addDoc } from "firebase/firestore";
import { FIREBASE_APP } from "../../firebase/firebase"; // presupunând că ați exportat firebaseApp din firebase.js

const addReviewToFirebase = async (review) => {
  const db = getFirestore(FIREBASE_APP);
  try {
    const docRef = await addDoc(collection(db, "reviews"), review);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export default addReviewToFirebase;
