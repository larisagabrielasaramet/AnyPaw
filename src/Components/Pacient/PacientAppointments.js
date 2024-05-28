import React from "react";

const PatientAppointments = () => {
  const appointments = [
    {
      id: 1,
      date: "2022-01-01",
      time: "10:00",
      doctor: "Dr. Smith",
      completed: true,
    },
    {
      id: 2,
      date: "2022-01-15",
      time: "14:00",
      doctor: "Dr. Johnson",
      completed: false,
    },
    // Adăugați mai multe programări aici
  ];

  return (
    <div>
      <h1>My Appointments</h1>
      {appointments.map((appointment) => (
        <div key={appointment.id}>
          <h2>
            {appointment.date} at {appointment.time}
          </h2>
          <p>Doctor: {appointment.doctor}</p>
          <p>Status: {appointment.completed ? "Completed" : "Upcoming"}</p>
        </div>
      ))}
    </div>
  );
};

export default PatientAppointments;
