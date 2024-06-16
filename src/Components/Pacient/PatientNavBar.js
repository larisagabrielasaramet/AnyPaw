import React from "react";
import { useNavigate } from "react-router-dom";
import { FIREBASE_AUTH as auth } from "../../firebase/firebase";
import {
  Nav,
  LogoContainer,
  Bars,
  NavMenu,
  NavLink,
  NavBtn,
  NavBtnLink,
} from "./NavBarElementsPatient";
import Logo from "../../Components/Logo";

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
        <LogoContainer>
          <Logo />
        </LogoContainer>
        <NavLink to="/patient" activeStyle end>
          Home
        </NavLink>
        <NavLink to="/patient/team" activeStyle end>
          Team
        </NavLink>
        <NavLink to="/patient/services" activeStyle end>
          Services
        </NavLink>
        <NavLink to="/patient/review" activeStyle end>
          Review
        </NavLink>
        <NavLink to="/patient/adoption" activeStyle end>
          Adoption
        </NavLink>
        <NavLink to="/patient/info" activeStyle end>
          Contact
        </NavLink>
        <NavLink to="/patient/appointments">Appointments</NavLink>
        <NavLink to="/patient/profile">Profile</NavLink>
      </NavMenu>
      <NavBtn>
        <NavBtnLink onClick={handleSignOut}>Sign Out</NavBtnLink>
      </NavBtn>
    </Nav>
  );
};

export default PatientNavbar;
