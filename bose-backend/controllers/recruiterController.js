const User = require('../models/userModel');
const Notification = require('../models/notificationModel');
const Message = require('../models/messageModel');

exports.searchCandidates = async (req, res) => {
    try {
        // Basic search - can be expanded
        const candidates = await User.find({ role: 'student' }).select('-password');
        // Mocking match score for now as requested by frontend complexity
        const enriched = candidates.map(c => ({
            id: c._id,
            name: c.name,
            skills: c.skills || [],
            experience: 2, // Mock
            location: 'Remote', // Mock
            verified: true, // Mock
            rating: 4.5 // Mock
        }));
        res.json(enriched);
    } catch (err) {
        res.status(500).json({ error: 'Search failed' });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const notes = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
        // Transform for frontend
        const formatted = notes.map(n => ({
            id: n._id,
            message: n.message,
            time: n.createdAt.toISOString(),
            read: n.read
        }));
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
}

exports.markNotificationRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
}

exports.getMessages = async (req, res) => {
    try {
        // Simple chat between recruiter and candidate
        const otherId = req.params.candidateId;
        const messages = await Message.find({
            $or: [
                { senderId: req.user.id, receiverId: otherId },
                { senderId: otherId, receiverId: req.user.id }
            ]
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
}

exports.sendMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const msg = await Message.create({
            senderId: req.user.id,
            receiverId: req.params.candidateId,
            text
        });
        res.json(msg);
    } catch (err) {
        res.status(500).json({ error: 'Failed to send' });
    }
}
