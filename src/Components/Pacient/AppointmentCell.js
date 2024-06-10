import { doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const AppointmentCell = ({
  handleSelectDoctor,
  hasAppointment,
  day,
  hour,
  doctors,
  appointments,
}) => {
  const [availableDocs, setAvailableDocs] = useState([]);

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
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const distance = (days.indexOf(day) - currentDayOfWeek + 7) % 7;
    const selectedDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + distance
    );
    const availableDoctors = doctors.filter((doctor) => {
      const doctorAppointments = appointments[doctor.uid] || [];
      // console.log("Doctor appointments: ", doctorAppointments);
      const hasAppointmentAtSameTime = doctorAppointments.some(
        (appointment) => {
          // console.log("++++++++++++", appointment);
          if (appointment && appointment.date) {
            const appointmentTime = appointment.date.toDate();

            const formattedSelectedTime = moment(selectedDate).format(
              "MMMM D, YYYY [at] h:mm A"
            );
            console.log("Selected time string: ", formattedSelectedTime);

            const formattedAppointmentTime = moment(appointmentTime).format(
              "MMMM D, YYYY [at] h:mm A"
            );
            console.log("Appointment time string: ", formattedAppointmentTime);
            return formattedSelectedTime === formattedAppointmentTime;
          }
          return false;
        }
      );

      return !hasAppointmentAtSameTime;
    });
    console.log("Available doctors: ", availableDoctors);
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
    <td>
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
