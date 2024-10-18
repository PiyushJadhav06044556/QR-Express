import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaQrcode } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import qrCodeImage from './logo.jpg';
import QRScanner from './QRScanner';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  font-family: 'Arial', sans-serif;
`;

const MainContent = styled.main`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5rem 2rem 2rem;
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 4rem 1rem 1rem;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 55%;

  @media (max-width: 768px) {
    max-width: 100%;
    text-align: center;
    margin-bottom: 2rem;
  }
`;

const Heading = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subheading = styled.h2`
  font-size: 1.2rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
  color: #e4e4e4;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: #f1f1f1;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const RightSection = styled.div`
  max-width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    max-width: 80%;
  }
`;

const QRImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
`;

const Footer = styled.footer`
  background: rgba(0, 0, 0, 0.15);
  padding: 1rem;
  text-align: center;
  color: #f1f1f1;
  font-size: 0.8rem;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const SocialIcon = styled(motion.a)`
  color: white;
  font-size: 1.2rem;
  transition: transform 0.3s ease;
`;

const CTAButton = styled(motion(Link))`
  display: inline-block;
  background-color: #4a69bd;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  margin-top: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1e3799;
  }
`;

const ScanButton = styled(motion.button)`
  position: fixed;
  top: 5rem;
  left: 1rem;
  background-color: #4a69bd;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 100;

  @media (max-width: 768px) {
    top: 4rem;
  }
`;

export default function Home() {
  const [showTyping, setShowTyping] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    setShowTyping(true);
  }, []);

  const handleScan = (data) => {
    if (data) {
      console.log('QR Code scanned:', data);
      // Handle the scanned data (e.g., navigate to the URL or display the content)
      alert(`QR Code scanned: ${data}`);
      setShowScanner(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <Container>
      <Navigation />
      <ScanButton
        onClick={() => setShowScanner(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaQrcode /> Scan QR
      </ScanButton>
      {showScanner && (
        <QRScanner
          onScan={handleScan}
          onError={handleError}
          onClose={() => setShowScanner(false)}
        />
      )}
      <MainContent>
        <LeftSection>
          {showTyping && (
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ fontSize: '1rem', marginBottom: '0.25rem', marginTop: '-0.5rem' }}
            >
              Welcome to QR Express!
            </motion.h3>
          )}
          <Heading>Create Your QR Code for FREE</Heading>
          <Subheading>
            Generate, manage, and track QR codes efficiently
          </Subheading>
          <Description>
            QR Express is your go-to platform for creating, customizing, and managing QR codes. 
            Share websites, contact info, or any data with ease. Track performance, gain insights, 
            and optimize usage for individuals and businesses alike.
          </Description>
          <CTAButton
            to="/generator"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create QR Code Now
          </CTAButton>
        </LeftSection>

        <RightSection>
        <QRImage src={qrCodeImage} alt="QR Code Generation" />
        </RightSection>
      </MainContent>

      <Footer>
        <SocialLinks>
          <SocialIcon
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          >
            <FaFacebookF />
          </SocialIcon>
          <SocialIcon
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          >
            <FaLinkedinIn />
          </SocialIcon>
          <SocialIcon
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          >
            <FaTwitter />
          </SocialIcon>
        </SocialLinks>
        <p>&copy; 2024 QR Express. All rights reserved.</p>
      </Footer>
    </Container>
  );
}