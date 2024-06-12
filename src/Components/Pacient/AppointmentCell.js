import { doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { moment } from "moment";
import styles from "./AppointmentCell.module.css";

const AppointmentCell = ({
  handleSelectDoctor,
  hasAppointment,
  day,
  hour,
  doctors,
  appointments,
  currentDate,
  index,
}) => {
  const [availableDocs, setAvailableDocs] = useState([]);
  const currentDateTime = new Date(
    currentDate.getTime() + index * 24 * 60 * 60 * 1000
  );
  currentDateTime.setHours(hour);

  useEffect(() => {
    checkDoctorAvailability(day, hour);
  }, [doctors, appointments]);

  const handleSelect = (day, hour, event) => {
    handleSelectDoctor(day, hour, event);
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
    const moment = require("moment");
    const selectedDate = new Date(currentDate);
    const currentDayOfWeek = selectedDate.getDay();
    const distance = (days.indexOf(day) - currentDayOfWeek + 7) % 7;
    const newselectedDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate() + distance
    );
    newselectedDate.setHours(hour); // Set the hour for the selected date

    const availableDoctors = doctors.filter((doctor) => {
      const doctorAppointments = appointments[doctor.uid] || [];
      const hasAppointmentAtSameTime = doctorAppointments.some(
        (appointment) => {
          if (appointment && appointment.date) {
            const appointmentTime = appointment.date.toDate();
            appointmentTime.setMinutes(0, 0, 0); // reset minutes and seconds to 0
            const newselectedDateTime = new Date(newselectedDate.getTime());
            newselectedDateTime.setMinutes(0, 0, 0); // reset minutes and seconds to 0
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
    <td className={availableDocs.length === 0 ? styles.noDoctors : ""}>
      {/* {hasAppointment ? null : ( */}
      <select onChange={(event) => handleSelect(day, hour, event)}>
        {availableDocs.map((doctor) => {
          return (
            <option key={doctor.id} value={doctor.id}>
              {doctor.fullName}
            </option>
          );
        })}
      </select>
      {/* )} */}
    </td>
  );
};

export default AppointmentCell;
