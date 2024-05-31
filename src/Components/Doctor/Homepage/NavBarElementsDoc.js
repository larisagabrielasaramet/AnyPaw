import { FaBars } from "react-icons/fa";
import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";

export const Nav = styled.nav`
  background: #008080; /* Dark Turquoise */
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
    color: #5f9ea0;
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
  background: #008080;
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: -100px;
`;

export const NavBtnLink = styled(Link)`
  border-radius: 24px;
  padding: 5px;
  background: #5F9EA0; 
  padding: 10px 20px;
  font-size: 1.3rem;
  text-align: center;
  color: white; 
  outline: none;
  border: none;
  cursor: pointer;
  height: 50px;
  width: 60px;
 
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  margin-left: 80px;
  &:hover {
    transition: all 0.2s ease-in-out;
    background: #006666; 
    color: #5F9EA0; 
`;

export const LogoContainer = styled.div`
  display: flex;
  margin-left: 30px;
  margin-right: 5px;
`;
