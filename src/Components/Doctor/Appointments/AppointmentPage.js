import React, { useEffect, useState, useMemo } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebase/firebase";
import styles from "./AppointmentPage.module.css";
import moment from "moment/moment";

const useHasAppointment = (appointments, week) => {
  return useMemo(() => {
    return (day, hour) => {
      return appointments.some((appointment) => {
        const appointmentDate = moment(appointment.date).local();

        const firstDayOfWeek = moment()
          .startOf("week")
          .add(week * 7, "days");
        const currentDate = firstDayOfWeek
          .clone()
          .add(day, "days")
          .add(hour, "hours");

        return (
          appointmentDate.isSame(currentDate, "day") &&
          appointmentDate.hour() === currentDate.hour()
        );
      });
    };
  }, [appointments, week]);
};

function AppointmentPage() {
  const [petDetails, setPetDetails] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [week, setWeek] = useState(0);
  const hours = Array.from({ length: 9 }, (_, i) => i + 9);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hasAppointment = useHasAppointment(appointments, week);
  const [appointmentId] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState({
    notes: "",
    notesSaved: false,
  });

  const petId = selectedAppointment?.petId;
  const [petDocRef, setPetDocRef] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  React.useEffect(() => {
    if (petId) {
      setPetDocRef(doc(FIREBASE_DB, "pet", petId));
    }
  }, [petId]);

  function handleClosePopup() {
    setIsPopupOpen(false);
  }

  async function handleAppointmentClick(appointment) {
    const petId = appointment.petId;
    const petDocRef = doc(FIREBASE_DB, "pet", petId);
    setPetDocRef(petDocRef);
    const petDocSnap = await getDoc(petDocRef);

    if (petDocSnap.exists()) {
      const petData = petDocSnap.data();
      setPetDetails(petData);
      setSelectedAppointment({ ...appointment });
      setIsPopupOpen(true);
    } else {
      console.error("No such pet document!");
    }
  }

  useEffect(() => {
    if (appointmentId) {
      const appointmentRef = doc(FIREBASE_DB, "dappointments", appointmentId);
      const unsubscribe = onSnapshot(
        appointmentRef,
        (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setSelectedAppointment({
              ...data,
              notesSaved: data.notesSaved || false, // Set notesSaved from the database
            });
          } else {
            console.log("No such document!");
          }
        },
        (error) => {
          console.log("Error fetching document:", error);
        }
      );
      return () => unsubscribe();
    }
  }, [appointmentId]);

  async function deleteAppointment() {
    try {
      if (selectedAppointment && selectedAppointment.id) {
        const appointmentRef = doc(
          FIREBASE_DB,
          "dappointments",
          selectedAppointment.id
        );
        await deleteDoc(appointmentRef);
        console.log("Appointment deleted successfully");

        // Actualizează starea appointments pentru a elimina programarea ștearsă
        setAppointments(
          appointments.filter(
            (appointment) => appointment.id !== selectedAppointment.id
          )
        );

        setSelectedAppointment(null);
        setIsPopupOpen(false);
      } else {
        console.error("No appointment selected or appointment ID is not valid");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  }
  useEffect(() => {
    const fetchAppointments = async () => {
      const querySnapshot = await getDocs(
        collection(FIREBASE_DB, "dappointments")
      );
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id, // include the document ID
        date: moment(doc.data().date.toDate()),
      }));
      console.log("fetchAppointments data:", data);
      setAppointments(data);
    };

    fetchAppointments();
  }, []);

  moment.locale("en", {
    week: {
      dow: 1, // Monday is the first day of the week
    },
  });

  const getFirstDayOfWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const numDay = dayOfWeek || 7;
    now.setDate(now.getDate() + (1 - numDay) + 7 * week);
    return now;
  };

  useEffect(() => {
    if (petId) {
      async function fetchData() {
        const localFirebaseDb = FIREBASE_DB;
        const localPetId = petId;

        if (!localFirebaseDb || !localPetId) {
          console.error("FIREBASE_DB or petId is undefined");
          return;
        }

        const petDocRef = doc(localFirebaseDb, "pet", localPetId);
        const petDoc = await getDoc(petDocRef);
        if (petDoc.exists()) {
          const petData = petDoc.data();
          console.log(petData);

          // Preia userId din petData
          const userId = petData.userId;

          // Folosește userId pentru a prelua datele utilizatorului
          const userDocRef = doc(FIREBASE_DB, "user", userId);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserDetails({
              fullName: userData.fullName,
              phone: userData.phone,
              address: userData.address,
            });
            console.log(userData.fullName); // Log the user's full name directly
          } else {
            console.error("No such user document!");
          }
        }
      }

      fetchData();
    }
  }, [petId]);

  async function saveNotes() {
    try {
      if (selectedAppointment && selectedAppointment.id) {
        const appointmentRef = doc(
          FIREBASE_DB,
          "dappointments",
          selectedAppointment.id
        );
        await updateDoc(appointmentRef, {
          notes: selectedAppointment.notes,
          notesSaved: true, // Save notesSaved in the database
        });
        setSelectedAppointment({ ...selectedAppointment, notesSaved: true });
        console.log("Notes saved successfully");
      }
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  }

  return (
    <div>
      <table className={styles.AppointmentPage}>
        <thead>
          <tr>
            <th>Hour</th>
            {days.map((day, index) => {
              const currentDate = new Date(
                getFirstDayOfWeek().getTime() + index * 24 * 60 * 60 * 1000
              );
              return (
                <th key={day}>
                  {currentDate.toLocaleDateString()} <br />
                  {day}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <tr key={hour}>
              <td>{hour}:00</td>
              {days.map((day, index) => {
                const appointment = appointments.find((app) => {
                  const appointmentDate = moment(app.date).local();
                  const currentDate = moment()
                    .startOf("week")
                    .add(week * 7 + index, "days")
                    .add(hour, "hours");
                  return appointmentDate.isSame(currentDate, "hour");
                });

                return (
                  <td
                    key={day}
                    className={
                      hasAppointment(index, hour)
                        ? `${styles.appointment} ${styles.specificAppointment}`
                        : ""
                    }
                  >
                    {hasAppointment(index, hour) ? (
                      <button
                        className={styles.appointmentButton}
                        onClick={() => handleAppointmentClick(appointment)}
                      >
                        Appointment
                      </button>
                    ) : (
                      ""
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {/* {selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          userDetails={userDetails}
          petDetails={petDetails}
        />
      )} */}

      {isPopupOpen && (
        <div className={styles.popup}>
          <div className={styles.popup_inner}>
            <button onClick={handleClosePopup}>Close</button>
            <button onClick={deleteAppointment}>Delete Appointment</button>
            <h2>Appointment Details</h2>
            <p>
              Date:{" "}
              {selectedAppointment && selectedAppointment.date
                ? moment(selectedAppointment.date).format(
                    "MMMM Do YYYY, h:mm:ss a"
                  )
                : "No appointment selected"}
            </p>
            <p>Pet's name: {petDetails?.name}</p>
            <p>Breed: {petDetails?.type}</p>
            <p>Age: {petDetails?.age}</p>
            <p>Owner: {userDetails && userDetails.fullName}</p>
            <p>Phone: {userDetails && userDetails.phone}</p>
            {selectedAppointment.notesSaved ? (
              <>
                <p>Notes: {selectedAppointment.notes}</p>
                <button
                  onClick={() =>
                    setSelectedAppointment({
                      ...selectedAppointment,
                      notesSaved: false,
                    })
                  }
                >
                  Edit Notes
                </button>
              </>
            ) : (
              <>
                <textarea
                  value={selectedAppointment.notes}
                  onChange={(e) =>
                    setSelectedAppointment({
                      ...selectedAppointment,
                      notes: e.target.value,
                    })
                  }
                />
                <button onClick={saveNotes}>Save Notes</button>
              </>
            )}
          </div>

          <div>
            {selectedAppointment && selectedAppointment.date
              ? moment(selectedAppointment.date).format(
                  "MMMM Do YYYY, h:mm:ss a"
                )
              : "No appointment selected"}
          </div>
        </div>
      )}

      <div className={styles.navigation}>
        <button
          className={styles.prevButton}
          onClick={() => setWeek(week - 1)}
        ></button>
        <button
          className={styles.nextButton}
          onClick={() => setWeek(week + 1)}
        ></button>
      </div>
    </div>
  );
}

export default AppointmentPage;
