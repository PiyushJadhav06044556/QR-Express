import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { css, Global } from '@emotion/react';

const globalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap');
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  font-family: 'Montserrat', sans-serif;
`;

const Form = styled.form`
  background: rgba(255, 255, 255, 0.8);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  width: 280px;

  @media (max-width: 768px) {
    width: 90%;
    max-width: 280px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.5);
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  background: #6e8efb;
  color: white;
  cursor: pointer;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 1rem;
`;

const Heading = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-size: 1.8rem;
  font-weight: bold;
  color: #4a4a4a;
  text-align: center;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
`;

const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const RememberMeLabel = styled.label`
  margin-left: 0.5rem;
  font-size: 0.9rem;
`;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      navigate('/home');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <Global styles={globalStyles} />
      <Container>
        <Heading>Welcome Back</Heading>
        <Form onSubmit={handleSubmit}>
          <h2>Log In</h2>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <RememberMeContainer>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <RememberMeLabel htmlFor="rememberMe">Remember me</RememberMeLabel>
          </RememberMeContainer>
          <Button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Log In
          </Button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </Form>
      </Container>
    </>
  );
}