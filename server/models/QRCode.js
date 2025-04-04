import mongoose from 'mongoose';

const qrCodeSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const QRCode = mongoose.model('QRCode', qrCodeSchema);

export default QRCode; 