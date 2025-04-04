import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const QRCodeScanner = () => {
  const [scannedResults, setScannedResults] = useState([]);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scanner.render(
      (decodedText) => {
        setScannedResults((prev) => {
          const newResults = [
            {
              text: decodedText,
              timestamp: new Date().toLocaleString()
            },
            ...prev
          ];
          // Keep only last 10 scans
          return newResults.slice(0, 10);
        });
      },
      (errorMessage) => {
        console.error('QR Code scanning error:', errorMessage);
      }
    );

    return () => {
      scanner.clear().catch(error => {
        console.error('Failed to clear scanner:', error);
      });
    };
  }, []);

  const removeResult = (index) => {
    setScannedResults((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Scan QR Code
      </Typography>
      <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', mb: 3 }}>
        <div id="reader"></div>
      </Box>

      <Typography variant="h6" gutterBottom>
        Scan History
      </Typography>
      <List>
        {scannedResults.map((result, index) => (
          <div key={index}>
            <ListItem
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => removeResult(index)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={result.text}
                secondary={result.timestamp}
              />
            </ListItem>
            {index < scannedResults.length - 1 && <Divider />}
          </div>
        ))}
        {scannedResults.length === 0 && (
          <ListItem>
            <ListItemText
              primary="No scans yet"
              secondary="Scan a QR code to see the results here"
            />
          </ListItem>
        )}
      </List>
    </Paper>
  );
};

export default QRCodeScanner; 