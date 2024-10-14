import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import qrCodeImage from './logo.jpg'; // Adjust the path as necessary
import Navigation from './Navigation';

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
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 55%;
`;

const Heading = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const Subheading = styled.h2`
  font-size: 1.2rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
  color: #e4e4e4;
`;

const Description = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  color: #f1f1f1;
  margin-bottom: 1rem;
`;

const RightSection = styled.div`
  max-width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const QRImage = styled.img`
  max-width: 80%;
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

export default function Home() {
  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    setShowTyping(true);
  }, []);

  return (
    <Container>
      <Navigation />

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