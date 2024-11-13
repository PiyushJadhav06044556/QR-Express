import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { storage, firestore, auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { QRCodeSVG } from 'qrcode.react';
import Navigation from './Navigation';
import { FaDownload, FaEnvelope, FaWhatsapp, FaGoogleDrive, FaPlus, FaTimes } from 'react-icons/fa';

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
  gap: 1rem;
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

const QRCodeCard = styled(motion.div)`
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const QRCodeTitle = styled.h2`
  color: #1a1a1a;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
`;

const QRCodeSubtitle = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin: 0;
  text-align: center;
`;

const QRCodeWrapper = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
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
  color: #ff6b6b;
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
  margin-bottom: 0.5rem;
`;

const MultipleFilesButton = styled(Button)`
  background-color: #4a69bd;
  margin-bottom: 1rem;
  width: 100%;
`;

const FileInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  position: relative;
`;

const FileInputRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #ff6b6b;
  }
`;

const MultipleQRCodeCard = styled(QRCodeCard)`
  max-width: 800px;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const QRCodeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const IndividualQRCode = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const QRCodeFileName = styled.p`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #4a5568;
  text-align: center;
  word-break: break-word;
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
  const [isMultipleFiles, setIsMultipleFiles] = useState(false);
  const [multipleFiles, setMultipleFiles] = useState([{ file: null, name: '' }]);
  const [multipleCardName, setMultipleCardName] = useState('');
  const qrRef = useRef(null);
  const multipleQrRefs = useRef([]);

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

  const handleMultipleFileChange = (index, file) => {
    if (file && file.size > 25 * 1024 * 1024) {
      setError(`File ${file.name} exceeds the 25MB size limit.`);
      return;
    }
    
    const newFiles = [...multipleFiles];
    newFiles[index] = { ...newFiles[index], file };
    setMultipleFiles(newFiles);
    setError('');
  };

  const handleMultipleNameChange = (index, name) => {
    const newFiles = [...multipleFiles];
    newFiles[index] = { ...newFiles[index], name };
    setMultipleFiles(newFiles);
  };

  const addFileInput = () => {
    if (multipleFiles.length < 6) {
      setMultipleFiles([...multipleFiles, { file: null, name: '' }]);
    }
  };

  const removeFileInput = (index) => {
    const newFiles = multipleFiles.filter((_, i) => i !== index);
    setMultipleFiles(newFiles);
  };

  const handleMultipleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setQrData('');
    setLoading(true);

    if (!auth.currentUser) {
      setError('You must be logged in to generate QR codes.');
      setLoading(false);
      return;
    }

    if (!multipleCardName) {
      setError('Please provide a name for your QR code collection.');
      setLoading(false);
      return;
    }

    const invalidFiles = multipleFiles.filter(
      ({ file, name }) => !file || !name
    );

    if (invalidFiles.length > 0) {
      setError('Please provide both file and name for all entries.');
      setLoading(false);
      return;
    }

    try {
      const uploadPromises = multipleFiles.map(async ({ file, name }) => {
        const storageRef = ref(
          storage,
          `files/${auth.currentUser.uid}/${multipleCardName}/${name}`
        );
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        return { name, url };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      const qrDataArray = uploadedFiles.map(({ url }) => url);

      await addDoc(collection(firestore, 'qrcodes'), {
        name: multipleCardName,
        data: JSON.stringify(qrDataArray),
        createdAt: new Date(),
        userId: auth.currentUser.uid,
        isFile: true,
        isMultiple: true,
        fileNames: multipleFiles.map(({ name }) => name)
      });

      setQrData(JSON.stringify(qrDataArray));
      setMessage("Here's your QR Codes collection!");
    } catch (error) {
      console.error('Error generating QR codes:', error);
      setError(`An error occurred while generating the QR codes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateMultipleQRCodeCard = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    const cardWidth = 800;
    const cardHeight = 1000;
    canvas.width = cardWidth;
    canvas.height = cardHeight;
    
    // Fill background with gradient
    const gradient = ctx.createLinearGradient(0, 0, cardWidth, cardHeight);
    gradient.addColorStop(0, "#f5f7fa");
    gradient.addColorStop(1, "#c3cfe2");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, cardWidth, cardHeight);
    
    // Add title
    ctx.fillStyle = '#2d3748';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(multipleCardName, cardWidth/2, 50);
    
    // Add subtitle
    ctx.fillStyle = '#4a5568';
    ctx.font = '20px Arial';
    ctx.fillText('QR Express Code Collection', cardWidth/2, 90);
    
    const qrSize = 180;
    const padding = 20;
    const startX = 40;
    const startY = 120;
    
    const qrPromises = multipleFiles.map(async (_, index) => {
      const qrSvg = document.getElementById(`multiple-qr-${index}`);
      const svgData = new XMLSerializer().serializeToString(qrSvg);
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
      });
    });

    return Promise.all(qrPromises).then(images => {
      images.forEach((img, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        const x = startX + col * (qrSize + padding);
        const y = startY + row * (qrSize + padding + 40);
        
        // Draw white background for QR code
        ctx.fillStyle = 'white';
        ctx.fillRect(x, y, qrSize, qrSize);
        
        // Draw QR code
        ctx.drawImage(img, x, y, qrSize, qrSize);
        
        // Add file name
        ctx.fillStyle = '#4a5568';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        const fileName = multipleFiles[index].name;
        const maxWidth = qrSize;
        let truncatedFileName = fileName;
        
        // Truncate file name if it's too long
        if (ctx.measureText(fileName).width > maxWidth) {
          let ellipsis = '...';
          let truncated = fileName;
          while (ctx.measureText(truncated + ellipsis).width > maxWidth && truncated.length > 0) {
            truncated = truncated.slice(0, -1);
          }
          truncatedFileName = truncated + ellipsis;
        }
        
        ctx.fillText(truncatedFileName, x + qrSize/2, y + qrSize + 25);
      });
      
      return canvas.toDataURL("image/png");
    });
  };

  const handleMultipleDownload = async () => {
    const cardData = await generateMultipleQRCodeCard();
    const downloadLink = document.createElement("a");
    downloadLink.download = `${multipleCardName}_qr_codes.png`;
    downloadLink.href = cardData;
    downloadLink.click();
  };

  const downloadQRCode = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    const cardWidth = 400;
    const cardHeight = 500;
    canvas.width = cardWidth;
    canvas.height = cardHeight;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, cardWidth, cardHeight);
    
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(name, cardWidth/2, 50);
    
    ctx.fillStyle = '#666666';
    ctx.font = '16px Arial';
    ctx.fillText('QR Express Code', cardWidth/2, 80);
    
    const qrSvg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(qrSvg);
    const img = new Image();
    
    img.onload = () => {
      const qrSize = 250;
      const qrX = (cardWidth - qrSize) / 2;
      const qrY = 120;
      
      ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${name}_qr_code.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
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
    window.open('https://drive.google.com', '_blank');
  };

  return (
    <PageContainer>
      <Navigation />
      <Container>
        <Section>
          {!isMultipleFiles ? (
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
          ) : (
            <Form onSubmit={handleMultipleSubmit}>
              <Input
                type="text"
                placeholder="Collection Name"
                value={multipleCardName}
                onChange={(e) => setMultipleCardName(e.target.value)}
                required
              />
              {multipleFiles.map((fileInput, index) => (
                <FileInputGroup key={index}>
                  <FileInputRow>
                    <Input
                      type="text"
                      placeholder={`File ${index + 1} Name`}
                      value={fileInput.name}
                      onChange={(e) => handleMultipleNameChange(index, e.target.value)}
                      required
                    />
                    <Input
                      type="file"
                      onChange={(e) => handleMultipleFileChange(index, e.target.files[0])}
                      required
                    />
                    {index > 0 && (
                      <RemoveButton onClick={() => removeFileInput(index)}>
                        <FaTimes />
                      </RemoveButton>
                    )}
                  </FileInputRow>
                </FileInputGroup>
              ))}
              {multipleFiles.length < 6 && (
                <MultipleFilesButton
                  type="button"
                  onClick={addFileInput}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlus /> Add File
                </MultipleFilesButton>
              )}
              <FileSizeLimit>Max file size limit is 25MB per file</FileSizeLimit>
              <Button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate QR Codes'}
              </Button>
            </Form>
          )}
          <MultipleFilesButton
            type="button"
            onClick={() => setIsMultipleFiles(!isMultipleFiles)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMultipleFiles ? 'Switch to Single File' : 'Switch to Multiple Files'}
          </MultipleFilesButton>
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
          {qrData && !isMultipleFiles && (
            <>
              <QRCodeCard
                ref={qrRef}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <QRCodeTitle>{name}</QRCodeTitle>
                <QRCodeSubtitle>QR Express Code</QRCodeSubtitle>
                <QRCodeWrapper>
                  <QRCodeSVG value={qrData} size={200} />
                </QRCodeWrapper>
              </QRCodeCard>
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
          {qrData && isMultipleFiles && (
            <>
              <MultipleQRCodeCard
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <QRCodeTitle>{multipleCardName}</QRCodeTitle>
                <QRCodeSubtitle>QR Express Code Collection</QRCodeSubtitle>
                <QRCodeGrid>
                  {JSON.parse(qrData).map((url, index) => (
                    <IndividualQRCode key={index}>
                      <QRCodeSVG
                        id={`multiple-qr-${index}`}
                        value={url}
                        size={150}
                      />
                      <QRCodeFileName>{multipleFiles[index].name}</QRCodeFileName>
                    </IndividualQRCode>
                  ))}
                </QRCodeGrid>
              </MultipleQRCodeCard>
              <ShareContainer>
                <ShareButton onClick={handleMultipleDownload} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <FaDownload />
                </ShareButton>
                {/* <ShareButton onClick={shareViaEmail} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <FaEnvelope />
                </ShareButton> */}
                <ShareButton onClick={shareViaWhatsApp} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <FaWhatsapp />
                </ShareButton>
                {/* <ShareButton onClick={shareViaGoogleDrive} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <FaGoogleDrive />
                </ShareButton> */}
              </ShareContainer>
            </>
          )}
        </Section>
      </Container>
    </PageContainer>
  );
}