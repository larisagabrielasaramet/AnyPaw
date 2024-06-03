import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SearchBar.module.css";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ pets }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const matchedPets = pets.filter((pet) =>
    pet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (id) => {
    navigate(`/doctor/patients/${id}`);
  };

  return (
    <div className={styles.SearchBar}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          placeholder="Search by pet name"
          value={searchTerm}
          onChange={handleChange}
        />
        <FiSearch className={styles.searchIcon} />
      </div>
      {searchTerm && matchedPets.length > 0 && (
        <div ref={dropdownRef} className={styles.dropdown}>
          {matchedPets.map((pet) => (
            <div key={pet.id} onClick={() => handleSelect(pet.id)}>
              {pet.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
