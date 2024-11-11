// import React, { useState } from 'react';
// import styled from '@emotion/styled';
// import { motion } from 'framer-motion';
// import { QrReader } from 'react-qr-reader';
// import { FaTimes } from 'react-icons/fa';

// const ScannerContainer = styled(motion.div)`
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-color: rgba(0, 0, 0, 0.8);
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   z-index: 1000;
// `;

// const ScannerWrapper = styled.div`
//   width: 80%;
//   max-width: 400px;
//   aspect-ratio: 1;
// `;

// const CloseButton = styled(motion.button)`
//   position: absolute;
//   top: 1rem;
//   right: 1rem;
//   background: none;
//   border: none;
//   color: white;
//   font-size: 1.5rem;
//   cursor: pointer;
// `;

// const ErrorMessage = styled.p`
//   color: #ff6b6b;
//   margin-top: 1rem;
//   text-align: center;
// `;

// const QRScanner = ({ onScan, onError, onClose }) => {
//   const [scanError, setScanError] = useState(null);

//   const handleScan = (result) => {
//     if (result) {
//       onScan(result.text);
//     }
//   };

//   const handleError = (error) => {
//     console.error('QR Scanner error:', error);
//     setScanError(error.message || 'An error occurred while scanning');
//     onError(error);
//   };

//   return (
//     <ScannerContainer
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//     >
//       <CloseButton
//         onClick={onClose}
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//       >
//         <FaTimes />
//       </CloseButton>
//       <ScannerWrapper>
//         <QrReader
//           onResult={handleScan}
//           onError={handleError}
//           constraints={{
//             facingMode: 'environment'
//           }}
//           videoId="qr-video"
//           scanDelay={300}
//           style={{ width: '100%', height: '100%' }}
//         />
//       </ScannerWrapper>
//       {scanError && <ErrorMessage>{scanError}</ErrorMessage>}
//     </ScannerContainer>
//   );
// };

// export default QRScanner;