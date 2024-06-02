import { FaBars } from "react-icons/fa";
import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";

export const Nav = styled.nav`
  background: #0a5c5c; /* Dark Turquoise */
  table-layout: fixed;
  height: 80px;
  display: flex;
  justify-content: space-between;
  padding: 0.2rem calc((100vw - 1000px) / 2);
  z-index: 12;
  width: 66%;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 0px 0px 0px 0px;
`;

export const NavLink = styled(Link)`
  color: white;
  display: flex;
  margin-right: 20px;
  align-items: center;
  text-decoration: none;
  padding-left: 50px;
  padding: 0 1rem;
  font-size: 1.3rem;
  height: 100%;
  cursor: pointer;
  &.active {
    color: #40e0d0;
  }
`;
export const Bars = styled(FaBars)`
  display: none;
  table-layout: fixed;
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
  margin-right: 150px;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavBtn = styled.nav`
  margin-top: 8px;
  padding: 15px;
  background: #0a5c5c;
  border-radius: 20px;
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: -130px;
`;

export const NavBtnLink = styled(Link)`
  padding: 15px;
  border-radius: 24px;
  background: #0a5c5c;
  border: 2px solid white; // setează lățimea la 2px și culoarea la alb
  text-align: center;
  font-size: 1.2rem;
  color: white;
  outline: none;
  cursor: pointer;
  height: 28px;
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center; // aliniază textul la centru pe axa verticală
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  margin-left: 80px;
  position: relative; // adăugat pentru a permite mutarea textului
  top: -5px; // mută textul 5px mai sus
  &:hover {
    transition: all 0.2s ease-in-out;
    background: white;
    color: #0a5c5c;
  }
`;
export const LogoContainer = styled.div`
  display: flex;
  margin-left: 30px;
  margin-right: 30px;
`;
