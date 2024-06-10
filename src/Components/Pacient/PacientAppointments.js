import React, { useState, useEffect } from "react";
import styles from "./PacientAppointments.module.css";
import moment from "moment/moment";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import AppointmentCell from "./AppointmentCell";

function AppointmentPage() {
  const [week, setWeek] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const hours = Array.from({ length: 9 }, (_, i) => i + 9);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const [availability, setAvailability] = useState({});

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

  const handleNext = () => {
    const newDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    setCurrentDate(newDate);
  };

  const handlePrev = () => {
    const newDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    setCurrentDate(newDate);
  };
  const getFirstDayOfWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const numDay = dayOfWeek || 7;
    now.setDate(now.getDate() + (1 - numDay) + 7 * week);
    return now;
  };
  const [currentDate, setCurrentDate] = useState(getFirstDayOfWeek());
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

      setAppointments(appointmentsByDoctor);
    };

    const fetchDoctors = async () => {
      const doctorsCollection = collection(FIREBASE_DB, "user");
      const doctorsSnapshot = await getDocs(doctorsCollection);
      const doctorsList = doctorsSnapshot.docs
        .map((doc) => doc.data())
        .filter((user) => user.isDoctor);
      const newDoctors = [...doctorsList];

      setDoctors(newDoctors);
    };

    fetchAppointments();
    fetchDoctors();
  }, [currentDate]);
  console.log("dataaa", currentDate);
  return (
    <div className={styles.appointmentContainer}>
      <table className={styles.AppointmentPage}>
        <thead>
          <tr>
            <th>Hour</th>
            {days.map((day, index) => {
              const date = new Date(
                currentDate.getTime() + index * 24 * 60 * 60 * 1000
              );

              return (
                <th key={day}>
                  {date.toLocaleDateString()} <br />
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
                const availableDoctors = availability[day]
                  ? availability[day][hour] || []
                  : [];

                const hasAppointment = availableDoctors.length === 0;
                console.log(
                  "maka",
                  new Date(currentDate.getTime() + index * 24 * 60 * 60 * 1000)
                );
                return (
                  <AppointmentCell
                    handleSelectDoctor={handleSelectDoctor}
                    hasAppointment={hasAppointment}
                    day={day}
                    hour={hour}
                    doctors={doctors}
                    appointments={appointments}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.navigation}>
        <button className={styles.prevButton} onClick={handlePrev}></button>
        <button className={styles.nextButton} onClick={handleNext}></button>
      </div>
    </div>
  );
}

export default AppointmentPage;
