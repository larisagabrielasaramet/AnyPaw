import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebase/firebase";
import styles from "./AppointmentPage.module.css";
import { useMemo } from "react";

import moment from "moment/moment";
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
  const [appointments, setAppointments] = useState([]);
  const [week, setWeek] = useState(0);
  const hours = Array.from({ length: 9 }, (_, i) => i + 9);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hasAppointment = useHasAppointment(appointments, week);

  useEffect(() => {
    const fetchAppointments = async () => {
      const querySnapshot = await getDocs(
        collection(FIREBASE_DB, "dappointments")
      );
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        date: moment(doc.data().date.toDate()),
      }));
      setAppointments(data);
    };

    fetchAppointments();
  }, []);

  moment.locale("en", {
    week: {
      dow: 1, // Monday is the first day of the week
    },
  });

  const getFirstDayOfWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const numDay = dayOfWeek || 7;
    now.setDate(now.getDate() + (1 - numDay) + 7 * week);
    return now;
  };

  return (
    <div>
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
                return (
                  <td
                    key={day}
                    className={
                      hasAppointment(index, hour)
                        ? `${styles.appointment} ${styles.specificAppointment}`
                        : ""
                    }
                  >
                    {hasAppointment(index, hour) ? "Appointment" : ""}
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
