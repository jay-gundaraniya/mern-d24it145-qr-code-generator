import { useState } from 'react';
import { Container, Box, Tabs, Tab } from '@mui/material';
import QRCodeGenerator from '../components/QRCodeGenerator';
import QRCodeScanner from '../components/QRCodeScanner';
import QRCodeHistory from '../components/QRCodeHistory';

const Home = () => {
  const [tab, setTab] = useState(0);
  const [qrCodes, setQrCodes] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleQRCodeGenerate = (newQRCode) => {
    setQrCodes((prev) => [newQRCode, ...prev]);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          aria-label="QR code tabs"
          centered
        >
          <Tab label="Generate" />
          <Tab label="Scan" />
          <Tab label="History" />
        </Tabs>
      </Box>

      <Box role="tabpanel" hidden={tab !== 0}>
        {tab === 0 && <QRCodeGenerator onGenerate={handleQRCodeGenerate} />}
      </Box>

      <Box role="tabpanel" hidden={tab !== 1}>
        {tab === 1 && <QRCodeScanner />}
      </Box>

      <Box role="tabpanel" hidden={tab !== 2}>
        {tab === 2 && <QRCodeHistory />}
      </Box>
    </Container>
  );
};

export default Home; 