import { collection, addDoc, doc, setDoc, Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { moment } from "moment";
import styles from "./AppointmentCell.module.css";
import swal from "sweetalert";
import { FIREBASE_DB } from "../../firebase/firebase";
const AppointmentCell = ({
  hasAppointment,
  day,
  hour,
  doctors,
  appointments,
  currentDate,
  uid,
  userId,
  index,
}) => {
  const [availableDocs, setAvailableDocs] = useState([]);
  // În starea componentei
  const [currentDateTime, setCurrentDateTime] = useState(
    new Date(currentDate.getTime() + index * 24 * 60 * 60 * 1000)
  );
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  // În useEffect
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
      (doctor) => doctor.uid === selectedDoctorId // căutăm doctorul după id, nu după nume
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
          if (
            !selectedDoctorId || // Use userId instead of id
            !selectedDateTime ||
            !inputPetId
          ) {
            console.error("One or more required fields are undefined");
            return;
          }
          const newselectedDateTime = new Date(currentDateTime.getTime());
          newselectedDateTime.setMinutes(0, 0, 0); // reset minutes and seconds to 0

          const docRef = doc(
            collection(FIREBASE_DB, "dappointments"), // schimbați "dappointments" cu numele colecției pentru programările pacienților
            `${selectedDoctorId}_${newselectedDateTime.getTime()}` // Use userId instead of id
          );
          setDoc(docRef, {
            userId: selectedDoctorId,
            date: selectedDateTime,
            petId: inputPetId,
          });
        }
        // console.log(currentDateTime.getTime());
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
    //const moment = require("moment");
    const selectedDate = new Date(currentDate);
    const currentDayOfWeek = selectedDate.getDay();
    const distance = (days.indexOf(day) - currentDayOfWeek + 7) % 7;
    const newselectedDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate() + distance
    );
    newselectedDate.setHours(hour); // Set the hour for the selected date
    console.log("New selected date: ", newselectedDate);

    const availableDoctors = doctors.filter((doctor) => {
      const doctorAppointments = appointments[doctor.uid] || [];
      console.log("Doctor appointments: ", doctorAppointments);
      const hasAppointmentAtSameTime = doctorAppointments.some(
        (appointment) => {
          if (appointment && appointment.date) {
            const appointmentTime = appointment.date.toDate();
            appointmentTime.setMinutes(0, 0, 0); // reset minutes and seconds to 0
            console.log("Appointment time: ", appointmentTime);
            const newselectedDateTime = new Date(newselectedDate.getTime());
            newselectedDateTime.setMinutes(0, 0, 0); // reset minutes and seconds to 0
            console.log("New selected date time: ", newselectedDateTime);
            setSelectedDateTime(newselectedDateTime);
            return appointmentTime.getTime() === newselectedDateTime.getTime();

            // const formattedSelectedTime = moment(newselectedDate).format(
            //   "MMMM D, YYYY [at] h:mm A"
            // );
            // console.log("Selected time string: ", formattedSelectedTime);

            // const formattedAppointmentTime = moment(appointmentTime).format(
            //   "MMMM D, YYYY [at] h:mm A"
            // );
            // console.log("Appointment time string: ", formattedAppointmentTime);
            // return formattedSelectedTime === formattedAppointmentTime;
          }
          return false;
        }
      );

      return !hasAppointmentAtSameTime;
    });
    console.log("Available doctors: ", availableDoctors, "at", newselectedDate);
    if (availableDoctors.length === 0) {
      // console.log(`No available doctors on ${day} at ${hour}:00`);
    }

    // console.log(
    //   `Available doctors: ${JSON.stringify(availableDoctors, null, 2)}`
    // );
    const newAvailableDocs = [...availableDoctors];

    setAvailableDocs(newAvailableDocs); // Actualizați starea cu doctorii disponibili
  };

  return (
    <td className={availableDocs.length === 0 ? styles.cell : ""}>
      {availableDocs.length === 0 ? (
        <div className={styles.noDoctors}>Unavailable</div>
      ) : (
        <select
          className={styles.dropdownDoctor}
          onChange={(event) => handleSelect(day, hour, event, currentDateTime)}
        >
          {availableDocs.map((doctor) => {
            return (
              <option key={doctor.id} value={doctor.uid} placeholder="+">
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
