import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { FIREBASE_DB as db } from "../../firebase/firebase";
import {
  FiEye,
  FiEyeOff,
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiHome,
} from "react-icons/fi";
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

  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isFullNameEmpty, setIsFullNameEmpty] = useState(false);
  const [isEmailEmpty, setIsEmailEmpty] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
  const [isPhoneEmpty, setIsPhoneEmpty] = useState(false);
  const [isAddressEmpty, setIsAddressEmpty] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length < 8) {
      setPasswordError("*Password must be at least 8 characters long*");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      setConfirmPasswordError("*Passwords do not match*");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(e.target.value)) {
      setEmailError("*Please enter a valid email*");
    } else {
      setEmailError("");
    }
  };

  const handleRegister = async (e) => {
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setPhoneError("");

    setIsFullNameEmpty(!fullName);
    setIsEmailEmpty(!email);
    setIsPasswordEmpty(!password);
    setIsPhoneEmpty(!phone);
    setIsAddressEmpty(!address);

    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone ||
      !address
    ) {
      setErrorMessage("*All fields are required*");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const user = userCredential.user;

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
      if (error.code === "auth/email-already-in-use") {
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
      <h2 className={styles.form_title}>Register</h2>

      <div className={styles.input_icon_wrapper}>
        <FiUser className={styles.input_icon_left} />
        <input
          className={`${styles.input} ${
            isFullNameEmpty ? styles.empty_error : ""
          }`}
          type="text"
          id="fullname"
          value={fullName}
          onChange={(e) => {
            setIsFullNameEmpty(false);
            setFullName(e.target.value);
          }}
          placeholder="full name"
        />
      </div>

      <div className={styles.input_field}>
        <div className={styles.input_icon_wrapper}>
          <FiMail className={styles.input_icon_left} />
          <input
            className={`${styles.input} ${
              isEmailEmpty ? styles.empty_error : ""
            }`}
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              handleEmailChange(e);
              setIsEmailEmpty(false);
            }}
            placeholder="email"
          />
          {emailError && <p className={styles.error_message}>{emailError}</p>}
        </div>
        <div className={styles.input_field}>
          <div className={styles.input_icon_wrapper}>
            <FiPhone className={styles.input_icon_left} />
            <input
              className={`${styles.input} ${
                isPhoneEmpty ? styles.empty_error : ""
              }`}
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setIsPhoneEmpty(false);
              }}
              placeholder="phone"
            />
            {phoneError && <p className={styles.error_message}>{phoneError}</p>}
          </div>
        </div>

        <div className={styles.input_field}>
          <div className={styles.input_icon_wrapper}>
            <FiHome className={styles.input_icon_left} />
            <input
              className={`${styles.input} ${
                isAddressEmpty ? styles.empty_error : ""
              }`}
              type="text"
              id="address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setIsAddressEmpty(false);
              }}
              placeholder="address"
            />
          </div>
        </div>
        <div className={styles.input_field}>
          <div className={styles.input_icon_wrapper}>
            <FiLock className={styles.input_icon_left} />
            <input
              className={`${styles.input} ${
                isPasswordEmpty ? styles.empty_error : ""
              }`}
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => {
                handlePasswordChange(e);
                setIsPasswordEmpty(false);
              }}
              placeholder="password"
            />
            <br />
            {showPassword ? (
              <FiEye
                className={styles.input_icon_right}
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <FiEyeOff
                className={styles.input_icon_right}
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
          {passwordError && (
            <p className={styles.error_message}>{passwordError}</p>
          )}
        </div>

        <div className={styles.input_field}>
          <div className={styles.input_icon_wrapper}>
            <FiLock className={styles.input_icon_left} />
            <input
              className={styles.input}
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="confirm password"
            />
            {showConfirmPassword ? (
              <FiEye
                className={styles.input_icon_right}
                onClick={() => setShowConfirmPassword(false)}
              />
            ) : (
              <FiEyeOff
                className={styles.input_icon_right}
                onClick={() => setShowConfirmPassword(true)}
              />
            )}
          </div>
          {confirmPasswordError && (
            <p className={styles.error_message}>{confirmPasswordError}</p>
          )}
        </div>
        <br />
        {errorMessage && <p className={styles.error_message}>{errorMessage}</p>}
        <button className={styles.btn} onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
