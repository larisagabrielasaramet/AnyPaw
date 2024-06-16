import React, { useState, useEffect } from "react";
import styles from "./PacientAppointments.module.css";
import moment from "moment/moment";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";
import AppointmentCell from "./AppointmentCell";
import { Spinner } from "react-bootstrap";

function AppointmentPage() {
  const [week, setWeek] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const hours = Array.from({ length: 9 }, (_, i) => i + 9);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const [availability, setAvailability] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  moment.locale("en", {
    week: {
      dow: 1,
    },
  });

  const handleNext = () => {
    const newDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    setCurrentDate(newDate);
    setSelectedDate(getFirstDayOfWeek(newDate));
  };

  const handlePrev = () => {
    const newDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    setCurrentDate(newDate);
    setSelectedDate(getFirstDayOfWeek(newDate));
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
    const fetchData = async () => {
      setIsLoading(true);

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

      const doctorsCollection = collection(FIREBASE_DB, "user");
      const doctorsSnapshot = await getDocs(doctorsCollection);
      const doctorsList = doctorsSnapshot.docs
        .map((doc) => doc.data())
        .filter((user) => user.isDoctor);
      const newDoctors = [...doctorsList];
      const patientsList = doctorsSnapshot.docs
        .map((doc) => doc.data())
        .filter((user) => !user.isDoctor);
      const newPatients = [...patientsList];

      setAppointments(appointmentsByDoctor);
      setDoctors(newDoctors);
      setPatients(newPatients);

      setIsLoading(false);
    };

    fetchData();
  }, [currentDate]);

  return (
    <div className={styles.appointmentContainer}>
      {isLoading ? (
        <div className={styles.spinnerContainer}>
          <Spinner animation="border" role="status">
            <span className="sr-only"></span>
          </Spinner>
        </div>
      ) : (
        <>
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
                    return (
                      <AppointmentCell
                        key={`${day}-${hour}`}
                        hasAppointment={hasAppointment}
                        day={day}
                        hour={hour}
                        doctors={doctors}
                        appointments={appointments}
                        selectedDate={selectedDate}
                        currentDate={currentDate}
                        userId={
                          getAuth().currentUser
                            ? getAuth().currentUser.uid
                            : null
                        }
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
        </>
      )}
    </div>
  );
}

export default AppointmentPage;
