import React, { useState } from "react";
import styles from "./AddPetForm.module.css";
import { useNavigate } from "react-router-dom"; // importați useNavigate

function AddPetForm({ onAddPet }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [weight, setWeight] = useState("");
  const [userId, setUserId] = useState("");
  const [entry, setEntry] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    onAddPet({ name, type, age, sex, weight, userId, entry });
    setName("");
    setType("");
    setAge("");
    setSex("");
    setWeight("");
    setUserId("");
    setEntry("");
    navigate("/doctor/patients");
  };

  return (
    <div className={styles.overlay}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Add new pet</h2>
        <label className={styles.label}>
          <input
            placeholder="Pet Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          <input
            placeholder="Breed"
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          <input
            placeholder="Age"
            type="text"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          <input
            placeholder="sex"
            type="text"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          <input
            placeholder="Weight"
            type="text"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          <input
            placeholder="User ID"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          <input
            placeholder="First entry"
            type="array"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            required
            className={styles.input}
          />
        </label>

        <button type="submit" className={styles.button}>
          Add Pet
        </button>
      </form>
    </div>
  );
}

export default AddPetForm;
