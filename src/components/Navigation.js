import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
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

const MotionLink = motion(Link);
const NavLink = styled(MotionLink)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const MotionButton = motion.button;
const NavButton = styled(MotionButton)`
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

const MobileMenu = styled(motion.div)`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #4a69bd;
  padding: 2rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileNavLink = styled(MotionLink)`
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

const CloseButton = styled(MotionButton)`
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

  const menuVariants = {
    closed: {
      opacity: 0,
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <Nav>
      <Logo to="/home">QR Express</Logo>
      <NavLinks>
        <NavLink 
          to="/home"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Home
        </NavLink>
        <NavLink 
          to="/generator"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Generate QR
        </NavLink>
        <NavLink 
          to="/history"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          History
        </NavLink>
        <NavLink 
          to="/contact"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Contact Us
        </NavLink>
        <NavButton
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Logout
        </NavButton>
      </NavLinks>
      <MobileMenuButton onClick={toggleMobileMenu}>
        <FaBars />
      </MobileMenuButton>
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <CloseButton
              onClick={closeMobileMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaTimes />
            </CloseButton>
            <MobileNavLink 
              to="/home"
              onClick={closeMobileMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Home
            </MobileNavLink>
            <MobileNavLink 
              to="/generator"
              onClick={closeMobileMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Generate QR
            </MobileNavLink>
            <MobileNavLink 
              to="/history"
              onClick={closeMobileMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              History
            </MobileNavLink>
            <MobileNavLink 
              to="/contact"
              onClick={closeMobileMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Contact Us
            </MobileNavLink>
            <NavButton
              onClick={() => {
                handleLogout();
                closeMobileMenu();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Logout
            </NavButton>
          </MobileMenu>
        )}
      </AnimatePresence>
    </Nav>
  );
}