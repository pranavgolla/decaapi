const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true
    },
    paragraph: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Services', contentSchema);
