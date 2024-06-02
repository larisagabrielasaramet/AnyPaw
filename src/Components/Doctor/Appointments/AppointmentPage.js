import React, { useEffect, useState, useMemo } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  onSnapshot,
  addDoc,
  where,
  query,
} from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../firebase/firebase";
import styles from "./AppointmentPage.module.css";
import moment from "moment/moment";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

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
  const [petIdState, setPetId] = useState("");
  const [petDocRef, setPetDocRef] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [appointmentDate, setAppointmentDate] = useState(null);

  React.useEffect(() => {
    if (petId) {
      setPetDocRef(doc(FIREBASE_DB, "pet", petId));
    } else {
      console.error("Pet ID is undefined!");
    }
  }, [petId]);

  function handleClosePopup() {
    setIsPopupOpen(false);
  }

  async function handleAppointmentClick(appointment) {
    const petId = appointment.petId;
    setPetId(petId);
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
              notesSaved: data.notesSaved || false,
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

  const fetchAppointments = async () => {
    const userId = FIREBASE_AUTH.currentUser
      ? FIREBASE_AUTH.currentUser.uid
      : null;
    if (!userId) {
      console.error("User is not logged in!");
      return;
    }
    const querySnapshot = await getDocs(
      query(
        collection(FIREBASE_DB, "dappointments"),
        where("userId", "==", userId)
      )
    );
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      date: moment(doc.data().date.toDate()),
    }));
    console.log("fetchAppointments data:", data);
    setAppointments(data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  moment.locale("en", {
    week: {
      dow: 1,
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
          const userId = petData.userId;

          const userDocRef = doc(FIREBASE_DB, "user", userId);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserDetails({
              fullName: userData.fullName,
              phone: userData.phone,
              address: userData.address,
            });
            console.log(userData.fullName);
          } else {
            console.error("No such user document!");
          }
        }
      }

      fetchData();
    }
  }, [petId]);

  function handlePetIdChange(event) {
    setPetId(event.target.value);
  }

  async function handleAddAppointment(day, hour) {
    const firstDayOfWeek = moment()
      .startOf("week")
      .add(week * 7, "days");
    const appointmentDate = firstDayOfWeek
      .clone()
      .add(day, "days")
      .add(hour, "hours");

    try {
      setAppointmentDate(appointmentDate.toDate());
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    handleShow();
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("petId:", petIdState);
    if (!petIdState) {
      console.error("Pet ID is not defined!");
      return;
    }

    const userId = FIREBASE_AUTH.currentUser
      ? FIREBASE_AUTH.currentUser.uid
      : null;
    const newAppointment = {
      petId: petIdState,
      date: appointmentDate,
      userId: userId,
    };

    try {
      const docRef = await addDoc(
        collection(FIREBASE_DB, "dappointments"),
        newAppointment
      );
      console.log("Document written with ID: ", docRef.id);
      handleClose();
      fetchAppointments();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  return (
    <div className={styles.appointmentContainer}>
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
                      <button
                        className={styles.addAppointmentButton}
                        onClick={() => handleAddAppointment(index, hour)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={show} onHide={handleClose}>
        <div className={styles.popup_app}>
          <div className={styles.popup_inner_app}>
            <Modal.Header>
              <Modal.Title></Modal.Title>
              <Button className={styles.closeButton} onClick={handleClose}>
                X
              </Button>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formPetId">
                  <Form.Label></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter pet ID"
                    value={petIdState}
                    onChange={handlePetIdChange}
                    className={styles.inputField}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className={styles.submitButton}
                >
                  Submit
                </Button>
              </Form>
            </Modal.Body>
          </div>
        </div>
      </Modal>

      {isPopupOpen && (
        <div className={styles.popup}>
          <div className={styles.popup_inner}>
            <button className={styles.deleteButton} onClick={deleteAppointment}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button className={styles.closeButton} onClick={handleClosePopup}>
              x
            </button>

            <h2>Appointment Details</h2>
            <p>
              <strong>Date:</strong>{" "}
              {selectedAppointment && selectedAppointment.date
                ? moment(selectedAppointment.date).format(
                    "MMMM Do YYYY, h:mm:ss a"
                  )
                : "No appointment selected"}
            </p>
            <p>
              <strong>Pet's name:</strong> {petDetails?.name}
            </p>
            <p>
              <strong>Breed:</strong> {petDetails?.type}
            </p>
            <p>
              <strong>Age:</strong> {petDetails?.age}
            </p>
            <p>
              <strong>Owner:</strong> {userDetails && userDetails.fullName}
            </p>
            <p>
              <strong>Phone:</strong> {userDetails && userDetails.phone}
            </p>
          </div>

          {/* <div>
            {selectedAppointment && selectedAppointment.date
              ? moment(selectedAppointment.date).format(
                  "MMMM Do YYYY, h:mm:ss a"
                )
              : "No appointment selected"}
          </div> */}
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
