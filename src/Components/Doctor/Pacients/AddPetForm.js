import React, { useState } from "react";
import styles from "./AddPetForm.module.css";
import { useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";

function AddPetForm({ onAddPet }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [weight, setWeight] = useState("");
  const [userId, setUserId] = useState("");
  const [entry, setEntry] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  const navigate = useNavigate();
  const handleEntryChange = (e) => {
    const newEntry = [...entry];
    newEntry.unshift(e.target.value);
    setEntry(newEntry);
  };
  const handleClose = () => {
    setIsOpen(false); // setează isOpen la false atunci când butonul este apăsat
  };

  if (!isOpen) {
    return null; // dacă formularul este închis, nu returnați nimic
  }
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
        <button onClick={handleClose} className={styles.closeButton}>
          x
        </button>
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
            type="text" // schimbați "array" în "text"
            value={entry[0] || ""} // afișează primul element al array-ului sau un string gol
            onChange={handleEntryChange} // folosiți noua funcție de manipulare
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
