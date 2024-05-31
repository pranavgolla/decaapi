const Services = require('../models/servicesModel');

// @desc    Create new Services
// @route   POST /api/Services
// @access  Public
exports.createServices = async (req, res) => {
    try {
        const { heading, paragraph } = req.body;

        const newServices = new Services({
            heading,
            paragraph
        });

        const savedServices = await newServices.save();
        res.status(201).json(savedServices);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get all Services
// @route   GET /api/Services
// @access  Public
exports.getAllServices = async (req, res) => {
    try {
        const services = await Services.find().sort({ createdAt: -1 });
        res.status(200).json(services);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get Services by ID
// @route   GET /api/Services/:id
// @access  Public
exports.getServicesById = async (req, res) => {
    try {
        const services = await Services.findById(req.params.id);

        if (!services) {
            return res.status(404).json({ msg: 'Services not found' });
        }

        res.status(200).json(services);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Services not found' });
        }
        res.status(500).send('Server error');
    }
};
