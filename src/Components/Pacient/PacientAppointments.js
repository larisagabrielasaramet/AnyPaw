import React, { useState, useEffect } from "react";
import styles from "./PacientAppointments.module.css";
import moment from "moment/moment";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";

function AppointmentPage() {
  const [week, setWeek] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const hours = Array.from({ length: 9 }, (_, i) => i + 9);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    const fetchAppointments = async () => {
      const appointmentsCollection = collection(FIREBASE_DB, "dappointments");
      const appointmentsSnapshot = await getDocs(appointmentsCollection);
      const appointmentsList = appointmentsSnapshot.docs.map((doc) =>
        doc.data()
      );
      setAppointments(appointmentsList);
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

  const checkDoctorAvailability = (day, hour) => {
    const selectedTime = moment(`${day} ${hour}:00`, "YYYY-MM-DD HH:mm");
    const availableDoctors = doctors.filter((doctor) => {
      const doctorAppointments = appointments.filter((appointment) => {
        if (appointment && appointment.timestamp) {
          const appointmentTime = moment(appointment.timestamp.toDate());
          return (
            appointment.userId === doctor.id &&
            appointmentTime.isSame(selectedTime, "hour")
          );
        }
        return false;
      });
      return doctorAppointments.length === 0;
    });
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

    // Crează un nou appointment
    const newAppointment = {
      day,
      hour,
      doctorId,
      userId,
    };

    try {
      // Adaugă noul appointment în Firestore
      const appointmentsCollection = collection(FIREBASE_DB, "appointments");
      await addDoc(appointmentsCollection, newAppointment);

      // Actualizează lista locală de appointments
      setAppointments((prevAppointments) => [
        ...prevAppointments,
        newAppointment,
      ]);
    } catch (error) {
      console.error("Error adding document: ", error);
      // Handle the error appropriately here
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
                const availableDoctors = checkDoctorAvailability(day, hour);
                const hasAppointment = availableDoctors.length === 0;
                return (
                  <td
                    key={day}
                    className={hasAppointment ? styles.red : styles.green}
                  >
                    {hasAppointment ? null : (
                      <select
                        onChange={(event) =>
                          handleSelectDoctor(day, hour, event)
                        }
                      >
                        {availableDoctors.map((doctor) => (
                          <option value={doctor.id}>{doctor.fullName}</option>
                        ))}
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
