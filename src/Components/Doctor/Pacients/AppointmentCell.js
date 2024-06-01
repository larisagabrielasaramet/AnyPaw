// import { useEffect, useState } from "react";

// const AppointmentCell = ({ day, hour, handleSelectDoctor }) => {
//   const [selectedDay, setSelectedDay] = useState(null);
//   const [selectedHour, setSelectedHour] = useState(null);

//   useEffect(() => {
//     if (selectedDay && selectedHour) {
//       // Apelați funcția cu currentDate aici
//       currentDate(
//         new Date(selectedDay.getTime() + selectedHour * 60 * 60 * 1000)
//       );
//     }
//   }, [selectedDay, selectedHour]);

//   return (
//     <td
//       key={day}
//       // className={hasAppointment ? styles.noDoctors : ""}
//     >
//       {hasAppointment ? null : (
//         <select
//           onChange={(event) => {
//             setSelectedDay(day);
//             setSelectedHour(hour);
//             handleSelectDoctor(day, hour, event);
//           }}
//         >
//           {availableDoctors.map((doctor) => {
//             return <option value={doctor.id}>{doctor.fullName}</option>;
//           })}
//         </select>
//       )}
//     </td>
//   );
// };

// export default AppointmentCell;
