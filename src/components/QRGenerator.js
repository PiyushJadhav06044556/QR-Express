import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { storage, firestore, auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { QRCodeSVG } from 'qrcode.react';
import Navigation from './Navigation';
import { FaDownload, FaEnvelope, FaWhatsapp, FaGoogleDrive } from 'react-icons/fa';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
`;

const Container = styled.div`
  display: flex;
  color: white;
  font-family: 'Arial', sans-serif;
  padding: 6rem 3rem 3rem;
  gap: 3rem;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

const QRCodeContainer = styled(motion.div)`
  padding: 2.5rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
`;

const Message = styled(motion.div)`
  margin-top: 1.5rem;
  font-weight: bold;
  font-size: 1.2rem;
`;

const ErrorMessage = styled(motion.div)`
  margin-top: 1.5rem;
  color: #ff6b6b;
  font-weight: bold;
  font-size: 1.2rem;
`;

const ShareContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ShareButton = styled(motion.button)`
  padding: 0.5rem;
  border: none;
  border-radius: 50%;
  background: #4a69bd;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #1e3799;
  }
`;

export default function QRGenerator() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [qrData, setQrData] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const qrRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setQrData('');

    if (!auth.currentUser) {
      setError('You must be logged in to generate a QR code.');
      return;
    }

    if (!name) {
      setError('Please provide a name for your QR code.');
      return;
    }

    if (!file && !url && !text) {
      setError('Please provide either a file, URL, or text for the QR code.');
      return;
    }

    try {
      let finalData;
      if (file) {
        const storageRef = ref(storage, `files/${auth.currentUser.uid}/${name}`);
        await uploadBytes(storageRef, file);
        finalData = await getDownloadURL(storageRef);
      } else if (url) {
        finalData = url;
      } else if (text) {
        finalData = text;
      }

      await addDoc(collection(firestore, 'qrcodes'), {
        name,
        data: finalData,
        createdAt: new Date(),
        userId: auth.currentUser.uid,
        isFile: !!file
      });

      setQrData(finalData);
      setMessage("Here's your QR Code!");
    } catch (error) {
      console.error('Error generating QR code:', error);
      setError(`An error occurred while generating the QR code: ${error.message}`);
    }
  };

  const downloadQRCode = () => {
    const canvas = document.createElement("canvas");
    const svg = qrRef.current.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${name}_qr_code.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Check out this QR Code');
    const body = encodeURIComponent(`I've generated a QR Code using QR Express. Here's the data: ${qrData}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`Check out this QR Code I generated using QR Express: ${qrData}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareViaGoogleDrive = () => {
    // Note: Sharing directly to Google Drive requires OAuth2 authentication and the Google Drive API
    // For simplicity, we'll open the Google Drive homepage
    window.open('https://drive.google.com', '_blank');
  };

  return (
    <PageContainer>
      <Navigation />
      <Container>
        <LeftSection>
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="QR Code Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Input
              type="url"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Enter Text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Generate QR Code
            </Button>
          </Form>
          {message && (
            <Message
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {message}
            </Message>
          )}
          {error && (
            <ErrorMessage
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {error}
            </ErrorMessage>
          )}
        </LeftSection>
        <RightSection>
          {qrData && (
            <>
              <QRCodeContainer
                ref={qrRef}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <QRCodeSVG value={qrData} size={300} />
              </QRCodeContainer>
              <ShareContainer>
                <ShareButton onClick={downloadQRCode} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <FaDownload />
                </ShareButton>
                <ShareButton onClick={shareViaEmail} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <FaEnvelope />
                </ShareButton>
                <ShareButton onClick={shareViaWhatsApp} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <FaWhatsapp />
                </ShareButton>
                {/* <ShareButton onClick={shareViaGoogleDrive} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <FaGoogleDrive />
                </ShareButton> */}
              </ShareContainer>
            </>
          )}
        </RightSection>
      </Container>
    </PageContainer>
  );
}