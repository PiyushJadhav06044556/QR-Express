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
  flex-direction: column;
  color: white;
  font-family: 'Arial', sans-serif;
  padding: 6rem 1rem 1rem;
  gap: 2rem;

  @media (min-width: 769px) {
    flex-direction: row;
    padding: 6rem 3rem 3rem;
    gap: 3rem;
  }
`;

const Section = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem; // Reduced gap between form elements
  width: 100%;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);

  @media (min-width: 769px) {
    padding: 2.5rem;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  @media (min-width: 769px) {
    font-size: 1.1rem;
  }
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: #4a69bd;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #1e3799;
  }

  @media (min-width: 769px) {
    font-size: 1.1rem;
  }
`;

const QRCodeContainer = styled(motion.div)`
  padding: 1.5rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  width: 100%;
  max-width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (min-width: 769px) {
    padding: 2.5rem;
  }
`;

const Message = styled(motion.div)`
  margin-top: 1.5rem;
  font-weight: bold;
  font-size: 1rem;
  text-align: center;
  color: white;

  @media (min-width: 769px) {
    font-size: 1.2rem;
  }
`;

const ErrorMessage = styled(Message)`
  color: white; // Updated color to white
`;

const ShareContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const ShareButton = styled(motion.button)`
  padding: 0.5rem;
  border: none;
  border-radius: 50%;
  background: #4a69bd;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #1e3799;
  }

  @media (min-width: 769px) {
    font-size: 1.5rem;
  }
`;

const FileSizeLimit = styled.p`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.5rem;
  margin-bottom: 0.5rem; // Added margin-bottom
`;

export default function QRGenerator() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [qrData, setQrData] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const qrRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 25 * 1024 * 1024) {
      setError('File size limit exceeded. Maximum file size is 25MB.');
      setFile(null);
    } else {
      setError('');
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setQrData('');
    setLoading(true);

    if (!auth.currentUser) {
      setError('You must be logged in to generate a QR code.');
      setLoading(false);
      return;
    }

    if (!name) {
      setError('Please provide a name for your QR code.');
      setLoading(false);
      return;
    }

    if (!file && !url && !text) {
      setError('Please provide either a file, URL, or text for the QR code.');
      setLoading(false);
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
    } finally {
      setLoading(false);
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
        <Section>
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
              onChange={handleFileChange}
            />
            <FileSizeLimit>Max file size limit is 25MB</FileSizeLimit>
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
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate QR Code'}
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
        </Section>
        <Section>
          {qrData && (
            <>
              <QRCodeContainer
                ref={qrRef}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <QRCodeSVG value={qrData} size={250} />
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
                <ShareButton onClick={shareViaGoogleDrive} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <FaGoogleDrive />
                </ShareButton>
              </ShareContainer>
            </>
          )}
        </Section>
      </Container>
    </PageContainer>
  );
}