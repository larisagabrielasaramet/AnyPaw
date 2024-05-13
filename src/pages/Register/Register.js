import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { FIREBASE_DB as db } from "../../firebase/firebase";
import { FiEye, FiEyeOff } from "react-icons/fi";
import styles from "./Register.module.css";
import Swal from "sweetalert2";

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullNameError, setFullNameError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(e.target.value)) {
      setEmailError("Please enter a valid email");
    } else {
      setEmailError("");
    }
  };

  const handleRegister = async (e) => {
    // Reset the error messages at the beginning of the function
    setFullNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setPhoneError("");
    setAddressError("");

    // Check if all fields are filled

    // If any field is empty, stop the function
    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone ||
      !address
    ) {
      setErrorMessage("All fields are mandatory");
      return;
    }

    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const user = userCredential.user;

      // Add a new document to the "user" collection
      await addDoc(collection(db, "user"), {
        uid: user.uid,
        fullName: fullName,
        email: email,
        phone: phone,
        address: address,
        isDoctor: false,
      });
      navigate("/signin");
    } catch (error) {
      // Handle any errors here
      if (error.code === "auth/email-already-in-use") {
        //setEmailError("There already exists an account with this email");
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "There already exists an account with this email!",
        });
      } else {
        console.error("Error creating user: ", error);
      }
    }
  };

  return (
    <div className={styles.form_container}>
      <h2>Register</h2>
      <div className={styles.input_field}>
        <label htmlFor="fullname">Full Name</label>
        <input
          className={styles.input}
          type="text"
          id="fullname"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        {fullNameError && <p>{fullNameError}</p>}
      </div>
      {/* {errorMessage && <p>{errorMessage}</p>} */}
      <div className={styles.input_field}>
        <label htmlFor="email">Email</label>
        <input
          className={styles.input}
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
        />
        {emailError && <p>{emailError}</p>}
      </div>
      <div className={styles.input_field}>
        <label htmlFor="phone">Phone</label>
        <input
          className={styles.input}
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {phoneError && <p>{phoneError}</p>}
      </div>
      <div className={styles.input_field}>
        <label htmlFor="address">Address</label>
        <input
          className={styles.input}
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        {addressError && <p>{addressError}</p>}
      </div>
      <div className={styles.input_field}>
        <div>
          <label htmlFor="password">Password</label>
        </div>
        <div className={styles.input_icon_wrapper}>
          <input
            className={styles.input}
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <br />
          {showPassword ? (
            <FiEye
              className={styles.input_icon}
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <FiEyeOff
              className={styles.input_icon}
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>
        {passwordError && <p>{passwordError}</p>}
      </div>
      <div className={styles.input_field}>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <div className={styles.input_icon_wrapper}>
          <input
            className={styles.input}
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          {showConfirmPassword ? (
            <FiEye
              className={styles.input_icon}
              onClick={() => setShowConfirmPassword(false)}
            />
          ) : (
            <FiEyeOff
              className={styles.input_icon}
              onClick={() => setShowConfirmPassword(true)}
            />
          )}
        </div>
        {confirmPasswordError && <p>{confirmPasswordError}</p>}
      </div>
      <br />
      {errorMessage && <p>{errorMessage}</p>}
      <button className={styles.btn} onClick={handleRegister}>
        Register
      </button>
    </div>
  );
};

export default Register;
