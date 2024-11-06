import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { FaBars, FaTimes } from 'react-icons/fa';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const NavButton = styled.button`
  color: white;
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(74, 105, 189, 1); // Solid background color
  padding: 2rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease-in-out;
  transform: translateX(-100%);

  &.open {
    transform: translateX(0);
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileNavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
`;

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <Nav>
      <Logo to="/home">QR Express</Logo>
      <NavLinks>
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/generator">Generate QR</NavLink>
        <NavLink to="/history">History</NavLink>
        <NavLink to="/contact">Contact Us</NavLink>
        <NavButton onClick={handleLogout}>Logout</NavButton>
      </NavLinks>
      <MobileMenuButton onClick={toggleMobileMenu}>
        <FaBars />
      </MobileMenuButton>
      <MobileMenu className={mobileMenuOpen ? 'open' : ''}>
        <CloseButton onClick={closeMobileMenu}>
          <FaTimes />
        </CloseButton>
        <MobileNavLink to="/home" onClick={closeMobileMenu}>
          Home
        </MobileNavLink>
        <MobileNavLink to="/generator" onClick={closeMobileMenu}>
          Generate QR
        </MobileNavLink>
        <MobileNavLink to="/history" onClick={closeMobileMenu}>
          History
        </MobileNavLink>
        <MobileNavLink to="/contact" onClick={closeMobileMenu}>
          Contact Us
        </MobileNavLink>
        <NavButton
          onClick={() => {
            handleLogout();
            closeMobileMenu();
          }}
        >
          Logout
        </NavButton>
      </MobileMenu>
    </Nav>
  );
}