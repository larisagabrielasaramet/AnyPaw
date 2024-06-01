import React, { useState, useEffect } from "react";
import styles from "./PacientAppointments.module.css";
import moment from "moment/moment";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

function AppointmentPage() {
  const [week, setWeek] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const hours = Array.from({ length: 9 }, (_, i) => i + 9);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const [availability, setAvailability] = useState({});

  // useEffect(() => {
  //   const newAvailability = {};
  //   days.forEach((day) => {
  //     newAvailability[day] = {};
  //     hours.forEach((hour) => {
  //       newAvailability[day][hour] = checkDoctorAvailability(day, hour);
  //     });
  //   });
  //   setAvailability(newAvailability);
  // }, [appointments, doctors]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const appointmentsCollection = collection(FIREBASE_DB, "dappointments");
      const appointmentsSnapshot = await getDocs(appointmentsCollection);
      const appointmentsList = appointmentsSnapshot.docs.map((doc) =>
        doc.data()
      );

      const appointmentsByDoctor = {};
      appointmentsList.forEach((appointment) => {
        if (!appointmentsByDoctor[appointment.userId]) {
          appointmentsByDoctor[appointment.userId] = [];
        }
        appointmentsByDoctor[appointment.userId].push(appointment);
      });
      console.log("---->>>>", appointmentsByDoctor);
      setAppointments(appointmentsByDoctor);
    };

    const fetchDoctors = async () => {
      const doctorsCollection = collection(FIREBASE_DB, "user");
      const doctorsSnapshot = await getDocs(doctorsCollection);
      const doctorsList = doctorsSnapshot.docs
        .map((doc) => doc.data())
        .filter((user) => user.isDoctor);
      setDoctors(doctorsList);
    };

    fetchAppointments();
    fetchDoctors();
  }, []);

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);

  useEffect(() => {
    checkDoctorAvailability(selectedDay, selectedHour);
  }, [selectedDay, selectedHour]);

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
    const formattedDate = `${selectedDate.getFullYear()}-${
      selectedDate.getMonth() + 1
    }-${selectedDate.getDate()}`;
    console.log(`Formatted date: ${formattedDate}`);
    const selectedTime = moment(
      `${formattedDate} ${hour}:00`,
      "YYYY-MM-DD HH:mm"
    );
    console.log(
      `Selected time: ${selectedTime.format(
        "MMMM D, YYYY [at] hh:mm:ss A [UTC]Z"
      )}`
    );

    console.log("Doctors: ", doctors);
    const availableDoctors = doctors.filter((doctor) => {
      const doctorAppointments = appointments[doctor.uid] || [];
      console.log("Doctor appointments: ", doctorAppointments);
      const hasAppointmentAtSameTime = doctorAppointments.some(
        (appointment) => {
          console.log("++++++++++++", appointment);
          if (appointment && appointment.date) {
            const appointmentTime = appointment.date.toDate();
            const options = {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
              timeZone: "Etc/GMT-3",
            };
            console.log("!!!!!!!!!!!", appointmentTime);
            const selectedTimeString = selectedTime.toLocaleString(
              "en-US",
              options
            );
            return (
              appointmentTime.toLocaleString("en-US", options) ===
              selectedTimeString
            );
          }
          return false;
        }
      );

      return !hasAppointmentAtSameTime;
    });

    if (availableDoctors.length === 0) {
      console.log(`No available doctors on ${day} at ${hour}:00`);
    }

    console.log(
      `Available doctors: ${JSON.stringify(availableDoctors, null, 2)}`
    );

    return availableDoctors;
  };
  moment.locale("en", {
    week: {
      dow: 1,
    },
  });
  const handleSelectDoctor = async (day, hour, event) => {
    const doctorId = event.target.value;
    const auth = getAuth();
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    const newAppointment = {
      doctorId,
      userId,
      timestamp: Timestamp.fromDate(new Date(`2024-05-30T${hour}:00:00+03:00`)),
    };

    try {
      const appointmentsCollection = collection(FIREBASE_DB, "dappointments");
      await addDoc(appointmentsCollection, newAppointment);

      setAppointments((prevAppointments) => {
        const newAppointments = { ...prevAppointments };
        if (!newAppointments[doctorId]) {
          newAppointments[doctorId] = [];
        }
        newAppointments[doctorId].push(newAppointment);
        return newAppointments;
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("There was an error scheduling the appointment. Please try again.");
    }
  };
  const getFirstDayOfWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const numDay = dayOfWeek || 7;
    now.setDate(now.getDate() + (1 - numDay) + 7 * week);
    return now;
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
              // console.log("currentDate", currentDate);
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
              {days.map((day) => {
                const availableDoctors = availability[day]
                  ? availability[day][hour] || []
                  : [];
                // console.log("availableDoctors", availableDoctors);
                const hasAppointment = availableDoctors.length === 0;
                return (
                  <td
                    key={day}
                    // className={hasAppointment ? styles.noDoctors : ""}
                  >
                    {hasAppointment ? null : (
                      <select
                        onChange={(event) => {
                          setSelectedDay(day);
                          setSelectedHour(hour);
                          handleSelectDoctor(day, hour, event);
                        }}
                      >
                        {availableDoctors.map((doctor) => {
                          // console.log(doctor);
                          return (
                            <option value={doctor.id}>{doctor.fullName}</option>
                          );
                        })}
                      </select>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

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
