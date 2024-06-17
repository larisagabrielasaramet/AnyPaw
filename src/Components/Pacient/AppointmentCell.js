import {
  collection,
  getDocs,
  doc,
  setDoc,
  where,
  query,
  deleteDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import moment from "moment";
import styles from "./AppointmentCell.module.css";
import swal from "sweetalert";
import { FIREBASE_DB } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";
import { Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
const AppointmentCell = ({
  day,
  hour,
  doctors,
  appointments,
  currentDate,
  index,
  petId,
  userId,
}) => {
  const [availableDocs, setAvailableDocs] = useState([]);
  const [appointmentState, setAppointmentState] = useState([]);
  const [isBookedByCurrentUser, setIsBookedByCurrentUser] = useState(false);
  const [newselectedDateTime, setNewselectedDateTime] = useState(new Date());
  const [hasNewAppointment, setHasNewAppointment] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [currentDateTime, setCurrentDateTime] = useState(
    new Date(currentDate.getTime() + index * 24 * 60 * 60 * 1000)
  );
  const [selectedDateTime, setSelectedDateTime] = useState(null);

  useEffect(() => {
    const newDateTime = new Date(
      currentDate.getTime() + index * 24 * 60 * 60 * 1000
    );
    newDateTime.setHours(hour);
    setCurrentDateTime(newDateTime);
    setIsLoading(true);
    checkDoctorAvailability(day, hour);
  }, [doctors, appointments, currentDate, hour, index, hasNewAppointment]);

  const handleSelect = (day, hour, event) => {
    const selectedDoctorId = event.target.value;
    const currentDateTime = new Date();

    const selectedDoctor = doctors.find(
      (doctor) => doctor.uid === selectedDoctorId
    );
    if (!selectedDoctor) {
      return;
    }

    swal({
      title: "Enter Pet ID",
      content: "input",
      button: {
        text: "Submit",
        closeModal: true,
        background: "#0a5c5c",
      },
    }).then((inputPetId) => {
      if (!inputPetId) {
        console.error("Pet ID is required");
        return;
      }
      swal({
        title: "Are you sure?",
        text: `Do you want to book an appointment on ${day} at ${hour} with ${selectedDoctor.fullName}?`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willBook) => {
        if (willBook) {
          if (!selectedDoctorId || !selectedDateTime || !inputPetId) {
            console.error("One or more required fields are undefined");
            return;
          }
          const newselectedDateTime = new Date(currentDateTime.getTime());
          newselectedDateTime.setMinutes(0, 0, 0);

          const docRef = doc(collection(FIREBASE_DB, "dappointments"));
          setDoc(docRef, {
            userId: selectedDoctorId,
            date: selectedDateTime,
            petId: inputPetId,
          });
          setHasNewAppointment(hasNewAppointment + 1);
        }
      });
    });
  };

  const checkDoctorAvailability = async (day, hour) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const selectedDate = new Date(currentDate);
    const currentDayOfWeek = selectedDate.getDay();
    const distance = (days.indexOf(day) - currentDayOfWeek + 7) % 7;
    const newselectedDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate() + distance
    );
    newselectedDate.setHours(hour);

    const availableDoctors = doctors.filter((doctor) => {
      const doctorAppointments = appointments[doctor.uid] || [];

      const hasAppointmentAtSameTime = doctorAppointments.some(
        (appointment) => {
          if (appointment && appointment.date) {
            const appointmentTime = appointment.date.toDate();
            appointmentTime.setMinutes(0, 0, 0);

            const newselectedDateTime = new Date(newselectedDate.getTime());
            newselectedDateTime.setMinutes(0, 0, 0);

            setSelectedDateTime(newselectedDateTime);
            return appointmentTime.getTime() === newselectedDateTime.getTime();
          }
          return false;
        }
      );

      return !hasAppointmentAtSameTime;
    });

    const newAvailableDocs = [...availableDoctors];
    setNewselectedDateTime(newselectedDateTime);
    setAvailableDocs(newAvailableDocs);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsBookedByCurrentUser(false);
    const checkIfBookedByCurrentUser = async () => {
      setIsLoading(true);
      const auth = getAuth();
      const currentUser = auth.currentUser;

      const uid = currentUser ? currentUser.uid : null;
      if (!uid) {
        setIsLoading(false);
        return;
      }

      const userRef = collection(FIREBASE_DB, "user");
      const userSnap = await getDocs(userRef);
      const userDoc = userSnap.docs.find((doc) => doc.data().uid === uid);

      if (!userDoc) {
        setIsLoading(false);
        return;
      }
      const patientId = userDoc.id;
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
        isCurrentUserAppointment: doc.data().userId === userId,
      }));

      if (currentUser) {
        const appointmentsRef = collection(FIREBASE_DB, "dappointments");
        const appointmentsSnap = await getDocs(appointmentsRef);
        const appointments = appointmentsSnap.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setAppointmentState(appointments);

        console.log(appointmentState);
        const petsRef = collection(FIREBASE_DB, "pet");
        const petsSnap = await getDocs(petsRef);
        const pets = petsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const userPetIds = pets
          .filter((pet) => pet.userId === patientId)
          .map((pet) => pet.id);

        const patientAppointments = appointments.filter((appointment) => {
          const appointmentDate = new Date(appointment.date.seconds * 1000);

          return (
            userPetIds.includes(appointment.petId) &&
            new Date(appointmentDate).getTime() ===
              new Date(selectedDateTime).getTime()
          );
        });

        const isBooked = patientAppointments.some(
          (appointment) =>
            new Date(appointment.date.seconds * 1000).getTime() ===
            selectedDateTime.getTime()
        );
        if (isBooked) {
          setIsBookedByCurrentUser(true);
        }
      }
      setIsLoading(false);
    };

    checkIfBookedByCurrentUser();
  }, [userId, petId, selectedDateTime]);
  useEffect(() => {}, [appointmentState]);
  const handleDelete = async () => {
    const appointmentToDelete = appointmentState.find(
      (appointment) =>
        new Date(appointment.date.seconds * 1000).getTime() ===
        selectedDateTime.getTime()
    );

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0a5c5c",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const docRef = doc(FIREBASE_DB, "dappointments", appointmentToDelete.id);
      console.log("Deleting appointment with id: ", docRef);
      await deleteDoc(docRef)
        .then(() => {
          Swal.fire(
            "Deleted!",
            "Your appointment has been deleted.",
            "success"
          );
        })
        .catch((error) => {
          console.error("Error deleting appointment: ", error);
        });

      setHasNewAppointment(hasNewAppointment - 1);
    }
  };
  return (
    <td
      className={
        isBookedByCurrentUser
          ? styles.bookedCell
          : availableDocs.length === 0
          ? styles.cell
          : ""
      }
    >
      {isLoading ? (
        <div>
          <Spinner animation="border" role="status">
            <span>...</span>
          </Spinner>
        </div>
      ) : isBookedByCurrentUser ? (
        <div className={styles.booked}>
          Booked by you
          <button className={styles.deleteButton} onClick={handleDelete}>
            <FaTrash />
          </button>
        </div>
      ) : availableDocs.length === 0 ? (
        <div className={styles.noDoctors}>Unavailable</div>
      ) : (
        <select
          className={styles.dropdownDoctor}
          onChange={(event) => handleSelect(day, hour, event, currentDateTime)}
        >
          <option className={styles.option1} value="" disabled selected>
            +
          </option>
          {availableDocs.map((doctor) => {
            return (
              <option key={doctor.id} value={doctor.uid}>
                {doctor.fullName}
              </option>
            );
          })}
        </select>
      )}
    </td>
  );
};

export default AppointmentCell;
