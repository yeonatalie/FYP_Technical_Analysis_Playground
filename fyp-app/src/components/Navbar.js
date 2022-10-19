import React from "react";
import { Nav, NavLink, NavMenu } from "./NavbarElements";
  
const Navbar = () => {
  return (
    <>
      <Nav>
        <NavMenu>
          <NavLink to="/home" activeStyle>Home</NavLink>
          <NavLink to="/tutorial" activeStyle>Tutorial</NavLink>
          <NavLink to="/backtest" activeStyle>Backtest</NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};
  
export default Navbar;