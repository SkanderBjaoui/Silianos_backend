const ContactMessage = require('../models/ContactMessage');

const formatMessage = (message) => ({
  id: message._id.toString(),
  name: message.name,
  email: message.email,
  phone: message.phone,
  subject: message.subject,
  message: message.message,
  status: message.status,
  created_at: message.createdAt,
  updated_at: message.updatedAt
});

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    res.json(messages.map(formatMessage));
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findById(id).lean();
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json(formatMessage(message));
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
};

exports.createMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const created = await ContactMessage.create({
      name,
      email,
      phone: phone || null,
      subject,
      message
    });

    res.status(201).json({
      id: created._id.toString(),
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updated = await ContactMessage.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: 'Message status updated successfully' });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ error: 'Failed to update message status' });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ContactMessage.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};

