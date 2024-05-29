import React from "react";
import Swal from "sweetalert2";

function AppointmentDetails({ appointment, userDetails, petDetails }) {
  React.useEffect(() => {
    if (appointment && userDetails && petDetails) {
      Swal.fire({
        title: "Detalii programare",
        html: `
          <p>Data: ${appointment.date}</p>
          <p>Utilizator: ${userDetails.fullName}</p>
          <p>Animal de companie: ${petDetails.name}, ${petDetails.sex}, ${petDetails.type}, ${petDetails.age} </p>
        `,
        confirmButtonText: "Închide",
        customClass: {
          popup: "my-popup",
        },
      });
    }
  }, [appointment, userDetails, petDetails]);

  return null;
}

export default AppointmentDetails;
