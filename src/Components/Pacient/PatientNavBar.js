import React from "react";
import { useNavigate } from "react-router-dom";
import { FIREBASE_AUTH as auth } from "../../firebase/firebase";
import {
  Nav,
  NavLogo,
  Bars,
  NavMenu,
  NavLink,
  NavBtn,
  NavBtnLink,
} from "./NavBarElementsPatient";

const PatientNavbar = () => {
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
      <Bars />
      <NavMenu>
        <NavLink to="/patient/profile">My Profile</NavLink>
        <NavLink to="/patient/appointments">Appointments</NavLink>
        {/* Add or remove links as needed */}
      </NavMenu>
      <NavBtn>
        <NavBtnLink onClick={handleSignOut}>Sign Out</NavBtnLink>
      </NavBtn>
    </Nav>
  );
};

export default PatientNavbar;
