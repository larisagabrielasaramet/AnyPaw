import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { FIREBASE_APP } from "../../firebase/firebase";

const addReviewToFirebase = async (review) => {
  const db = getFirestore(FIREBASE_APP);

  try {
    const docRef = await addDoc(collection(db, "reviews"), {
      ...review,
      date: serverTimestamp(),
      isPosted: false,
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export default addReviewToFirebase;
