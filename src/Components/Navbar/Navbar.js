import React from "react";
import Logo from "../Logo";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
  LogoContainer,
} from "./NavbarElements";

const Navbar = () => {
  return (
    <>
      <Nav>
        <Bars />

        <NavMenu>
          <LogoContainer>
            <Logo />
          </LogoContainer>
          <NavLink to="/" activeStyle>
            Home
          </NavLink>
          <NavLink to="/team" activeStyle>
            Team
          </NavLink>
          <NavLink to="/services" activeStyle>
            Services
          </NavLink>
          <NavLink to="/review" activeStyle>
            Review
          </NavLink>
          <NavLink to="/adoption" activeStyle>
            Adoption
          </NavLink>
          <NavLink to="/info" activeStyle>
            Contact
          </NavLink>
        </NavMenu>
        <NavBtn>
          <NavBtnLink to="/signin">Sign in</NavBtnLink>
        </NavBtn>
      </Nav>
    </>
  );
};

export default Navbar;
