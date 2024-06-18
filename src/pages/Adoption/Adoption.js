import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";
import AdoptionCard from "./AdoptionCard";
import styles from "./Adoption.module.css";
import { Link } from "react-router-dom";

const Adoption = () => {
  const [adoptions, setAdoptions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userAdoptions, setUserAdoptions] = useState([]);
  const [viewAll, setViewAll] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const fetchAdoptions = async () => {
    const adoptionsCollection = collection(FIREBASE_DB, "adoption");
    const adoptionsSnapshot = await getDocs(adoptionsCollection);
    let adoptionsList = await Promise.all(
      adoptionsSnapshot.docs.map(async (adoptionDoc) => {
        const adoption = adoptionDoc.data();
        let userName = "";
        if (adoption.userId) {
          const userSnapshot = await getDoc(
            doc(FIREBASE_DB, "user", adoption.userId)
          );
          const user = userSnapshot.data();
          userName = user ? user.fullname : "";
        }
        return { ...adoption, userName };
      })
    );
    adoptionsList = adoptionsList.sort((a, b) => {
      if (!b.createdAt || !a.createdAt) {
        return -1;
      }
      return b.createdAt.seconds - a.createdAt.seconds;
    });
    setAdoptions(adoptionsList);
  };
  const fetchUserAdoptions = async () => {
    const uid = currentUser ? currentUser.uid : null;
    if (uid) {
      const userQuerySnapshot = await getDocs(
        query(collection(FIREBASE_DB, "user"), where("uid", "==", uid))
      );
      if (!userQuerySnapshot.empty) {
        const userDoc = userQuerySnapshot.docs[0];
        const userId = userDoc.id;
        setUserId(userId);
        console.log(`Verifying userId: ${userId}`);
        const adoptionQuerySnapshot = await getDocs(
          query(
            collection(FIREBASE_DB, "adoption"),
            where("userId", "==", userId)
          )
        );
        const data = adoptionQuerySnapshot.docs.map((doc) => {
          const adoptionData = doc.data();
          return {
            ...adoptionData,
            id: doc.id,
          };
        });
        setUserAdoptions(data);
      }
    }
  };
  useEffect(() => {
    fetchAdoptions();
    fetchUserAdoptions();
  }, [currentUser]);
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this adoption!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      const docRef = doc(FIREBASE_DB, "adoption", id);
      await deleteDoc(docRef);
      setAdoptions(adoptions.filter((adoption) => adoption.id !== id));
      setUserAdoptions(userAdoptions.filter((adoption) => adoption.id !== id));
      Swal.fire("Deleted!", "The adoption has been deleted.", "success");
      fetchAdoptions();
      fetchUserAdoptions();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("Cancelled", "The adoption is safe :)", "error");
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.motto}>
        <h3>Adopt today and change a life forever.</h3>
        <Link to={currentUser ? "/form" : "/signin"}>
          <button className={styles.adopt_button}>Add New Adoption</button>
        </Link>
      </div>
      {currentUser && (
        <div className={styles.button_group}>
          <button onClick={() => setViewAll(false)}>My Adoptions</button>
          <button onClick={() => setViewAll(true)}>All Adoptions</button>
        </div>
      )}
      {viewAll ? (
        <div className={styles.all_adoption}>
          <h3>All Adoptions</h3>
          {adoptions.map((adoption) => (
            <AdoptionCard
              key={adoption.id}
              adoption={adoption}
              currentUser={currentUser}
              handleDelete={handleDelete}
              userId={userId}
            />
          ))}
        </div>
      ) : (
        <div className={styles.my_adoption}>
          <h3>My Adoptions</h3>
          {userAdoptions.map((adoption) => (
            <AdoptionCard
              key={adoption.id}
              adoption={adoption}
              currentUser={currentUser}
              handleDelete={handleDelete}
              userId={userId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Adoption;
