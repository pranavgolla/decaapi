const Content = require('../models/contentModel');

// @desc    Create new content
// @route   POST /api/content
// @access  Public
exports.createContent = async (req, res) => {
    try {
        const { heading, paragraph } = req.body;

        const newContent = new Content({
            heading,
            paragraph
        });

        const savedContent = await newContent.save();
        res.status(201).json(savedContent);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get all content
// @route   GET /api/content
// @access  Public
exports.getAllContent = async (req, res) => {
    try {
        const content = await Content.find().sort({ createdAt: -1 });
        res.status(200).json(content);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get content by ID
// @route   GET /api/content/:id
// @access  Public
exports.getContentById = async (req, res) => {
    try {
        const content = await Content.findById(req.params.id);

        if (!content) {
            return res.status(404).json({ msg: 'Content not found' });
        }

        res.status(200).json(content);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Content not found' });
        }
        res.status(500).send('Server error');
    }
};
