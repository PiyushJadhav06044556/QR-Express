import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
import { firestore } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
`;

const Container = styled.div`
  padding: 6rem 3rem 3rem;
  color: white;
  font-family: 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.1);
  padding: 2.5rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
`;

const Input = styled.input`
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.1rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.1rem;
  min-height: 150px;
  resize: vertical;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: #4a69bd;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #1e3799;
  }
`;

const Message = styled(motion.div)`
  margin-top: 1.5rem;
  font-weight: bold;
  font-size: 1.2rem;
  text-align: center;
`;

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'contactMessages'), {
        name,
        email,
        message,
        createdAt: new Date()
      });
      setSubmitMessage('Thank you for your message. We\'ll get back to you soon!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error submitting message:', error);
      setSubmitMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <Navigation />
      <Container>
        <Title>Contact Us</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextArea
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <Button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </Form>
        {submitMessage && (
          <Message
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {submitMessage}
          </Message>
        )}
      </Container>
    </PageContainer>
  );
}