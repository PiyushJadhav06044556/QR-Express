import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Home from './components/Home';
import QRGenerator from './components/QRGenerator';
import History from './components/History';
import ContactUs from './components/ContactUs';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={user ? <Navigate to="/home" /> : <SignUp />} />
        <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
        <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/generator" element={user ? <QRGenerator /> : <Navigate to="/login" />} />
        <Route path="/history" element={user ? <History /> : <Navigate to="/login" />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;