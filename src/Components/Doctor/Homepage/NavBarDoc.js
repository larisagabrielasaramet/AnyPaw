import React from "react";
import { useNavigate } from "react-router-dom";
import { FIREBASE_AUTH as auth } from "../../../firebase/firebase";

import {
  Nav,
  LogoContainer,
  Bars,
  NavMenu,
  NavLink,
  NavBtn,
  NavBtnLink,
} from "./NavBarElementsDoc";

const DoctorNavbar = () => {
  let navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <Nav>
      <LogoContainer>{/* Add your logo here */}</LogoContainer>
      <Bars />
      <NavMenu>
        <NavLink to="/doctor/profile">My Profile</NavLink>
        <NavLink to="/doctor/appointments">Appointments</NavLink>
        <NavLink to="/doctor/patients">My Patients</NavLink>
        {/* Add or remove links as needed */}
      </NavMenu>
      <NavBtn>
        <NavBtnLink onClick={handleSignOut}>Sign Out</NavBtnLink>
      </NavBtn>
    </Nav>
  );
};

export default DoctorNavbar;
