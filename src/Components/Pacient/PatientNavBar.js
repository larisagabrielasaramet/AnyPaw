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
        <NavLink to="/patient/team" activeStyle>
          Team
        </NavLink>
        <NavLink to="/patient/services" activeStyle>
          Services
        </NavLink>
        <NavLink to="/patient/review" activeStyle>
          Review
        </NavLink>
        <NavLink to="/patient/adoption" activeStyle>
          Adoption
        </NavLink>
        <NavLink to="/patient/info" activeStyle>
          Contact
        </NavLink>
        <NavLink to="/patient/appointments">Appointments</NavLink>
        <NavLink to="/patient/profile">My Profile</NavLink>
      </NavMenu>
      <NavBtn>
        <NavBtnLink onClick={handleSignOut}>Sign Out</NavBtnLink>
      </NavBtn>
    </Nav>
  );
};

export default PatientNavbar;
