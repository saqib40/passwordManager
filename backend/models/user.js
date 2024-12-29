const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
    },
    salt: {
        type: String,
        required: true,
        default: crypto.randomBytes(16).toString('hex'),
    },
    docs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Docs",
        }
    ]
});

module.exports = mongoose.model("Users", userSchema);