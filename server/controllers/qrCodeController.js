import QRCode from 'qrcode';
import QRCodeModel from '../models/QRCode.js';
import nodemailer from 'nodemailer';

// Generate QR Code
export const generateQRCode = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.id;

    // Generate QR code data URL
    const qrDataUrl = await QRCode.toDataURL(text);

    // Save QR code to database
    const qrCode = new QRCodeModel({
      text,
      userId
    });
    await qrCode.save();

    res.status(201).json({
      message: 'QR Code generated successfully',
      qrCode: {
        id: qrCode._id,
        text: qrCode.text,
        generatedAt: qrCode.generatedAt,
        qrDataUrl
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating QR code', error: error.message });
  }
};

// Get all QR codes with pagination and filters
export const getQRCodes = async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    const userId = req.user.id;

    // Build query
    const query = { userId };
    if (startDate && endDate) {
      query.generatedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get total count
    const total = await QRCodeModel.countDocuments(query);

    // Get paginated results
    const qrCodes = await QRCodeModel.find(query)
      .sort({ generatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Generate QR code data URLs
    const qrCodesWithDataUrls = await Promise.all(
      qrCodes.map(async (qrCode) => {
        const qrDataUrl = await QRCode.toDataURL(qrCode.text);
        return {
          ...qrCode.toObject(),
          qrDataUrl
        };
      })
    );

    res.json({
      qrCodes: qrCodesWithDataUrls,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching QR codes', error: error.message });
  }
};

// Delete QR code
export const deleteQRCode = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const qrCode = await QRCodeModel.findOneAndDelete({ _id: id, userId });
    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    res.json({ message: 'QR code deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting QR code', error: error.message });
  }
};

// Share QR code via email
export const shareQRCode = async (req, res) => {
  try {
    const { qrCodeId, recipientEmail } = req.body;
    const userId = req.user.id;

    // Find QR code
    const qrCode = await QRCodeModel.findOne({ _id: qrCodeId, userId });
    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    // Generate QR code data URL
    const qrDataUrl = await QRCode.toDataURL(qrCode.text);

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: 'Shared QR Code',
      html: `
        <h2>Shared QR Code</h2>
        <p>Here's the QR code that was shared with you:</p>
        <img src="${qrDataUrl}" alt="QR Code" />
        <p>Text content: ${qrCode.text}</p>
      `
    });

    res.json({ message: 'QR code shared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sharing QR code', error: error.message });
  }
}; 