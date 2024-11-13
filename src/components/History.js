import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getDownloadURL, ref, deleteObject } from 'firebase/storage';
import { firestore, storage, auth } from '../firebase';
import { QRCodeSVG } from 'qrcode.react';
import Navigation from './Navigation';
import { FaWhatsapp, FaDownload } from 'react-icons/fa';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
`;

const Container = styled.div`
  padding: 6rem 1rem 1rem;
  color: white;
  font-family: 'Arial', sans-serif;

  @media (min-width: 768px) {
    padding: 6rem 3rem 3rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  position: relative;
`;

const QRCodeContainer = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ItemName = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 1.4rem;
  }
`;

const ItemDate = styled.p`
  font-size: 0.9rem;
  color: #e0e0e0;
  margin-bottom: 0.5rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const ItemType = styled.p`
  font-size: 0.9rem;
  color: #f0f0f0;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const NoItemsMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  margin-top: 2rem;

  @media (min-width: 768px) {
    font-size: 1.4rem;
  }
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  margin-top: 2rem;

  @media (min-width: 768px) {
    font-size: 1.4rem;
  }
`;

const ErrorMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  margin-top: 2rem;
  color: #ff6b6b;

  @media (min-width: 768px) {
    font-size: 1.4rem;
  }
`;

const Button = styled.button`
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff4757;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const DeleteButton = styled(Button)`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
`;

const ShareContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const ShareButton = styled.button`
  background-color: #4a69bd;
  color: white;
  border: none;
  padding: 0.5rem;
  font-size: 1.2rem;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1e3799;
  }
`;

const QRCodeGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
`;

const IndividualQRCode = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const QRCodeFileName = styled.p`
  font-size: 0.8rem;
  color: #e0e0e0;
  text-align: center;
`;

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    if (!auth.currentUser) {
      console.log('No authenticated user');
      setLoading(false);
      return;
    }

    const q = query(
      collection(firestore, 'qrcodes'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    try {
      const querySnapshot = await getDocs(q);
      const fetchedItems = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const item = doc.data();
          if (item.isMultiple) {
            const urls = JSON.parse(item.data);
            return { ...item, id: doc.id, data: urls };
          } else if (item.isFile) {
            try {
              const url = await getDownloadURL(ref(storage, item.data));
              return { ...item, id: doc.id, data: url };
            } catch (error) {
              console.error('Error fetching file URL:', error);
              return { ...item, id: doc.id, data: 'Error loading file' };
            }
          } else {
            return { ...item, id: doc.id };
          }
        })
      );

      setItems(fetchedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your entire QR code history? This action cannot be undone.')) {
      setLoading(true);
      try {
        for (const item of items) {
          await deleteDoc(doc(firestore, 'qrcodes', item.id));
          if (item.isFile) {
            const storageRef = ref(storage, item.data);
            await deleteObject(storageRef);
          }
        }
        setItems([]);
        alert('Your QR code history has been cleared successfully.');
      } catch (error) {
        console.error('Error clearing history:', error);
        setError('Failed to clear history. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteItem = async (item) => {
    if (window.confirm(`Are you sure you want to delete the QR code for "${item.name}"? This action cannot be undone.`)) {
      setLoading(true);
      try {
        await deleteDoc(doc(firestore, 'qrcodes', item.id));
        if (item.isFile) {
          const storageRef = ref(storage, item.data);
          await deleteObject(storageRef);
        }
        setItems(items.filter((i) => i.id !== item.id));
        alert(`QR code for "${item.name}" has been deleted successfully.`);
      } catch (error) {
        console.error('Error deleting item:', error);
        setError(`Failed to delete QR code for "${item.name}". Please try again.`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDownloadQRCode = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}.png`;
    link.click();
  };

  const handleShareQRCode = (url) => {
    const shareText = `Check out this QR code: ${url}`;
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappURL, '_blank');
  };

  if (loading) {
    return (
      <PageContainer>
        <Navigation />
        <Container>
          <LoadingMessage>Loading your QR code history...</LoadingMessage>
        </Container>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Navigation />
        <Container>
          <ErrorMessage>Error: {error}</ErrorMessage>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Navigation />
      <Container>
        <Title>Your QR Code History</Title>
        <ButtonContainer>
          <Button onClick={handleClearHistory}>Clear All History</Button>
        </ButtonContainer>
        {items.length > 0 ? (
          <Grid>
            {items.map((item) => (
              <Card key={item.id}>
                <DeleteButton onClick={() => handleDeleteItem(item)}>Delete</DeleteButton>
                {item.isMultiple ? (
                  <QRCodeGrid>
                    {item.data.map((url, index) => (
                      <IndividualQRCode key={index}>
                        <QRCodeSVG value={url} size={100} />
                        <QRCodeFileName>{item.fileNames[index]}</QRCodeFileName>
                      </IndividualQRCode>
                    ))}
                  </QRCodeGrid>
                ) : (
                  <QRCodeContainer>
                    <QRCodeSVG value={item.data} size={150} />
                  </QRCodeContainer>
                )}
                <ItemName>{item.name}</ItemName>
                <ItemDate>{item.createdAt.toDate().toLocaleString()}</ItemDate>
                <ItemType>{item.isFile ? (item.isMultiple ? 'Multiple Files' : 'File') : 'Text/URL'}</ItemType>
                <ShareContainer>
                  <ShareButton onClick={() => handleShareQRCode(item.data)} title="Share on WhatsApp">
                    <FaWhatsapp />
                  </ShareButton>
                  <ShareButton onClick={() => handleDownloadQRCode(item.data, item.name)} title="Download QR Code">
                    <FaDownload />
                  </ShareButton>
                </ShareContainer>
              </Card>
            ))}
          </Grid>
        ) : (
          <NoItemsMessage>No QR codes generated yet.</NoItemsMessage>
        )}
      </Container>
    </PageContainer>
  );
}
