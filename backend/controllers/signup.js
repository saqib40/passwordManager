const userModel = require("../models/user");
const otpModel = require("../models/otp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require('otp-generator');
const transporter = require("../config/nodemailer");
//const session = require('express-session');
const crypto = require('crypto');

exports.signup = async (req, res) => {
    try {
        // Get user data
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Create OTP
        const otp = otpGenerator.generate(8, {
            upperCase: true,
            lowerCase: true,
            digits: true,
        });

        // Hash OTP
        const hashedOTP = await bcrypt.hash(otp, 10);

        // Save OTP
        await otpModel.create({
            email,
            otpHash: hashedOTP,
            createdAt: new Date(),
        });

        // Send OTP
        await transporter.sendMail({
            from: "Password Manager <ambernoah44@gmail.com>",
            to: email,
            subject: "This OTP will expire in 2 minutes",
            html: `<h2>Your OTP is</h2> <p>${otp}</p>`,
        })

        return res.status(200).json({
            success: true,
            message: "OTP sent to email",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered, please try again later",
        });
    }
};

//otp verification of signup
exports.verifyOTP = async (req, res) => {
    try {
        // Get user data and OTP
        const { username, email, password, otp } = req.body;

        // Find the OTP in the database
        const otpFromDB = await otpModel.findOne({ email });

        if (!otpFromDB) {
            return res.status(400).json({
                success: false,
                message: "OTP expired or invalid",
            });
        }

        // Verify OTP
        const isOTPValid = await bcrypt.compare(otp, otpFromDB.otpHash);

        if (!isOTPValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Secure the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user entry in DB
        await userModel.create({
            username,
            email,
            password: hashedPassword,
        });

        // Remove the OTP from database
        await otpModel.findOneAndDelete({ email });

        return res.status(200).json({
            success: true,
            message: "User created successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered, please try again later",
        });
    }
};