import React, { useState } from "react";

const PatientProfile = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [medicalHistory, setMedicalHistory] = useState(
    "No known medical history"
  );

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleMedicalHistoryChange = (event) => {
    setMedicalHistory(event.target.value);
  };

  return (
    <div>
      <h1>Patient Profile</h1>
      <label>
        Name:
        <input type="text" value={name} onChange={handleNameChange} />
      </label>
      <label>
        Email:
        <input type="email" value={email} onChange={handleEmailChange} />
      </label>
      <label>
        Medical History:
        <textarea
          value={medicalHistory}
          onChange={handleMedicalHistoryChange}
        />
      </label>
    </div>
  );
};

export default PatientProfile;
