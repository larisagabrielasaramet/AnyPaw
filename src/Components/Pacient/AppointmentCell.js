import {
  collection,
  getDocs,
  doc,
  setDoc,
  where,
  query,
  getDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { moment } from "moment";
import styles from "./AppointmentCell.module.css";
import swal from "sweetalert";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";
const AppointmentCell = ({
  hasAppointment,
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
  // În starea componentei
  const [appointmentState, setAppointmentState] = useState([]);
  const [isBookedByCurrentUser, setIsBookedByCurrentUser] = useState(false);
  const [newselectedDateTime, setNewselectedDateTime] = useState(new Date());

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
    checkDoctorAvailability(day, hour);
  }, [doctors, appointments, currentDate, hour, index]);

  useEffect(() => {
    checkDoctorAvailability(day, hour);
  }, [doctors, appointments]);

  const handleSelect = (day, hour, event) => {
    console.log("Day: ", day);
    console.log("Hour: ", hour);
    console.log("Event: ", event);

    const selectedDoctorId = event.target.value;
    console.log("Selected doctor id: ", selectedDoctorId);
    console.log("Selected date and time: ", selectedDateTime);
    const currentDateTime = new Date();

    console.log(
      "handleSelect called with",
      day,
      hour,
      selectedDoctorId,
      selectedDateTime
    );
    const selectedDoctor = doctors.find(
      (doctor) => doctor.uid === selectedDoctorId
    );
    if (!selectedDoctor) {
      console.error(`No doctor found with id ${selectedDoctorId}`);
      return;
    }

    swal({
      title: "Enter Pet ID",
      content: "input",
      button: {
        text: "Submit",
        closeModal: true,
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

          const docRef = doc(
            collection(FIREBASE_DB, "dappointments"),
            `${selectedDoctorId}_${newselectedDateTime.getTime()}`
          );
          setDoc(docRef, {
            userId: selectedDoctorId,
            date: selectedDateTime,
            petId: inputPetId,
          });
        }
      });
    });
  };
  const checkDoctorAvailability = (day, hour) => {
    console.log("Checking doctor availability for ", day, hour);
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
    console.log("New selected date: ", newselectedDate);

    const availableDoctors = doctors.filter((doctor) => {
      const doctorAppointments = appointments[doctor.uid] || [];
      console.log("Doctor appointments: ", doctorAppointments);
      const hasAppointmentAtSameTime = doctorAppointments.some(
        (appointment) => {
          if (appointment && appointment.date) {
            const appointmentTime = appointment.date.toDate();
            appointmentTime.setMinutes(0, 0, 0);
            console.log("Appointment time: ", appointmentTime);
            const newselectedDateTime = new Date(newselectedDate.getTime());
            newselectedDateTime.setMinutes(0, 0, 0);
            console.log("New selected date time: ", newselectedDateTime);
            setSelectedDateTime(newselectedDateTime);
            return appointmentTime.getTime() === newselectedDateTime.getTime();
          }
          return false;
        }
      );

      return !hasAppointmentAtSameTime;
    });
    console.log("Available doctors: ", availableDoctors, "at", newselectedDate);
    if (availableDoctors.length === 0) {
    }
    const newAvailableDocs = [...availableDoctors];
    setNewselectedDateTime(newselectedDateTime);
    setAvailableDocs(newAvailableDocs);
  };
  useEffect(() => {
    const checkIfBookedByCurrentUser = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      const uid = currentUser ? currentUser.uid : null;
      if (!uid) {
        console.error("User is not logged in!");
        return;
      }

      console.log("Checking document for uid:", uid); // Log the uid

      const userRef = collection(FIREBASE_DB, "user");
      const userSnap = await getDocs(userRef);
      const userDoc = userSnap.docs.find((doc) => doc.data().uid === uid);

      if (!userDoc) {
        console.error("User document does not exist!");
        return;
      }
      const docId = userDoc.id;
      console.log("User's document ID (userId):", docId);
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
        console.log("Current user ID:", docId);

        setAppointmentState(data);
        const appointmentsRef = collection(FIREBASE_DB, "dappointments");
        const appointmentsSnap = await getDocs(appointmentsRef);
        const appointments = appointmentsSnap.docs.map((doc) => {
          console.log(doc.data()); // log the entire document data
          return doc.data();
        });

        const petsRef = collection(FIREBASE_DB, "pet");
        const petsSnap = await getDocs(petsRef);
        const pets = petsSnap.docs.map((doc) => doc.data());

        // Get the petIds of the pets that belong to the current user
        const userPetIds = pets.filter((pets) => pets.userId === docId);
        console.log("Appointments:", appointments);

        console.log("ID CURENT", docId);
        console.log("pets:", pets);
        console.log("User Pet IDs:", userPetIds);
        console.log("!!!!!!!!!!!!!Selected DateTime:", selectedDateTime);
        // Filter the appointments that belong to the current user's pets
        const patientAppointments = appointments.filter((appointment) => {
          const appointmentDate = new Date(appointment.date.seconds * 1000);
          console.log("Appointment date:", appointmentDate);
          console.log(appointmentDate, selectedDateTime);
          return (
            // userPetIds.includes(appointment.docId) &&

            new Date(appointmentDate).getTime() ===
            new Date(selectedDateTime).getTime() // compare the time values
          );
        });

        console.log(
          "Appointments:",
          appointments.map((a) => ({
            userId: a.userId,
            date: a.date.toDate(),
            petId: a.petId,
          }))
        );

        console.log("Patient app:", patientAppointments);

        // Check if the selected date and time matches any of the user's appointments
        const isBooked = patientAppointments.some(
          (appointment) =>
            new Date(appointment.date.seconds * 1000).getTime() ===
            selectedDateTime.getTime()
        );

        console.log("!Is booked:", isBooked);

        if (isBooked) {
          setIsBookedByCurrentUser(true);
        }
      }
    };

    checkIfBookedByCurrentUser();
  }, [userId, petId, selectedDateTime]);
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
      {isBookedByCurrentUser ? (
        <div className={styles.booked}>Booked by you</div>
      ) : availableDocs.length === 0 ? (
        <div className={styles.noDoctors}>Unavailable</div>
      ) : (
        <select
          className={styles.dropdownDoctor}
          onChange={(event) => handleSelect(day, hour, event, currentDateTime)}
        >
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
