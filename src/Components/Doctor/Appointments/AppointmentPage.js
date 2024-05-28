import React from "react";
import styles from "./AppointmentPage.module.css";

function AppointmentPage() {
  const hours = Array.from({ length: 24 }, (_, i) => i); // generează un array cu orele de la 0 la 23
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <table className={styles.appointment_table}>
      <thead>
        <tr>
          <th>Hour</th>
          {days.map((day) => (
            <th key={day}>{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {hours.map((hour) => (
          <tr key={hour}>
            <td>{hour}:00</td>
            {days.map((day) => (
              <td key={day}></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AppointmentPage;
