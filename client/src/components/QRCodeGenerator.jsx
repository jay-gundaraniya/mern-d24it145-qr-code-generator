import { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import * as api from '../utils/api';

const QRCodeGenerator = ({ onGenerate }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.generateQRCode(text);
      setText('');
      setSuccess('QR Code generated successfully!');
      onGenerate(response.data.qrCode);
    } catch (error) {
      setError(error.response?.data?.message || 'Error generating QR code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Generate QR Code
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Enter URL or text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          margin="normal"
          required
          disabled={loading}
        />
        <Box sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Generate QR Code'}
          </Button>
        </Box>
      </form>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default QRCodeGenerator; 