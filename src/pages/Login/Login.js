import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebase/firebase";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";
import Swal from "sweetalert2";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      alert("Login successful!");
    } catch (error) {
      // Use Swal.fire to display the error message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Login failed!",
      });
    }
  };

  return (
    <div className={styles.form_container}>
      <div className={styles.form_group}>
        <label htmlFor="email">Email</label>
        <input
          className={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className={styles.input_field}>
        <label htmlFor="password">Password</label>
        <div className={styles.input_icon_wrapper}>
          <input
            className={styles.input}
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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
        {passwordError && (
          <p className={styles.error_message}>{passwordError}</p>
        )}
      </div>
      <button className={styles.btn} onClick={handleLogin}>
        Login
      </button>
      <p className={styles.register_link}>
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>
    </div>
  );
};

export default Login;
