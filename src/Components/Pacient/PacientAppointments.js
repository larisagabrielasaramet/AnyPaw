import React, { useState } from "react";
import styles from "./PacientAppointments.module.css";
import moment from "moment/moment";

function AppointmentPage() {
  const [week, setWeek] = useState(0);
  const hours = Array.from({ length: 9 }, (_, i) => i + 9);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  moment.locale("en", {
    week: {
      dow: 1,
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
              {days.map((day, index) => (
                <td key={day}></td>
              ))}
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
