import { FaBars } from "react-icons/fa";
import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";

export const Nav = styled.nav`
  background: #008080; /* Dark Turquoise */
  height: 60px;
  display: flex;
  justify-content: space-between;
  padding: 0.2rem calc((100vw - 1000px) / 2);
  z-index: 12;
  width: 30%;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 10px 10px 10px 10px; /* Round the bottom corners */
`;

export const NavLink = styled(Link)`
  color: white; /* Alb */
  display: flex;
  margin-right: 5px;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
  &.active {
    color: #add8e6; /* Alta nuanță de Turquoise */
  }
`;

export const Bars = styled(FaBars)`
  display: none;
  color: black; /* Alb */
  @media screen and (max-width: 768px) {
    display: white;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 75%);
    font-size: 1.8rem;
    cursor: pointer;
  }
`;

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  content: "";
  margin-right: 110px;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavBtn = styled.nav`
  background: #008080; /* Dark Turquoise */
  display: flex;
  align-items: center;
  margin-left: auto;
`;

export const NavBtnLink = styled(Link)`
  align-items: center;
  border-radius: 24px;
  background: #5F9EA0; 
  padding: 10px 20px;
  color: white; 
  outline: none;
  border: none;
  cursor: pointer;
  height: 25px;
  width: 50px;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  margin-left: 75px;
  &:hover {
    transition: all 0.2s ease-in-out;
    background: #5F9EA0; 
    color: #add8e6; 
`;

export const LogoContainer = styled.div`
  display: flex;
  margin-right: auto;
`;
