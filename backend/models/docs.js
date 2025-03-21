const mongoose = require('mongoose');

const docSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    password: { // encrypted password
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Docs", docSchema);