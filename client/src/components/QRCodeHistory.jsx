import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Box,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Share as ShareIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as api from '../utils/api';

const QRCodeHistory = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedQRCode, setSelectedQRCode] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const fetchQRCodes = async () => {
    try {
      const response = await api.getQRCodes(page, 6, startDate, endDate);
      setQrCodes(response.data.qrCodes);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      showNotification('Error fetching QR codes', 'error');
    }
  };

  useEffect(() => {
    fetchQRCodes();
  }, [page, startDate, endDate]);

  const handleDelete = async (id) => {
    try {
      await api.deleteQRCode(id);
      showNotification('QR code deleted successfully');
      fetchQRCodes();
    } catch (error) {
      showNotification('Error deleting QR code', 'error');
    }
  };

  const handleShare = (qrCode) => {
    setSelectedQRCode(qrCode);
    setShareDialogOpen(true);
  };

  const handleShareSubmit = async () => {
    try {
      await api.shareQRCode(selectedQRCode.id, recipientEmail);
      setShareDialogOpen(false);
      setRecipientEmail('');
      showNotification('QR code shared successfully');
    } catch (error) {
      showNotification('Error sharing QR code', 'error');
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification('Text copied to clipboard');
    } catch (error) {
      showNotification('Error copying to clipboard', 'error');
    }
  };

  const handleDownload = (qrDataUrl, text) => {
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `qr-code-${text.substring(0, 20)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        QR Code History
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <DatePicker
          selected={startDate}
          onChange={setStartDate}
          customInput={<TextField label="Start Date" />}
          placeholderText="Start Date"
        />
        <DatePicker
          selected={endDate}
          onChange={setEndDate}
          customInput={<TextField label="End Date" />}
          placeholderText="End Date"
        />
      </Box>

      <Grid container spacing={3}>
        {qrCodes.map((qrCode) => (
          <Grid item xs={12} sm={6} md={4} key={qrCode.id}>
            <Card>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <img
                    src={qrCode.qrDataUrl}
                    alt="QR Code"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {qrCode.text}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Generated: {new Date(qrCode.generatedAt).toLocaleString()}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleCopy(qrCode.text)} size="small">
                  <CopyIcon />
                </IconButton>
                <IconButton onClick={() => handleShare(qrCode)} size="small">
                  <ShareIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDownload(qrCode.qrDataUrl, qrCode.text)}
                  size="small"
                >
                  <DownloadIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(qrCode.id)} size="small">
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {qrCodes.length === 0 && (
        <Typography textAlign="center" color="text.secondary" sx={{ mt: 3 }}>
          No QR codes found
        </Typography>
      )}

      {totalPages > 1 && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
        <DialogTitle>Share QR Code</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Recipient Email"
            type="email"
            fullWidth
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleShareSubmit} variant="contained">
            Share
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default QRCodeHistory; 