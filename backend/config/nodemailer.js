const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587, // Use 587 for TLS
    secure: false, // False for 587 (TLS), true for 465 (SSL)
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

module.exports = transporter;