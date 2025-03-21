const userModel = require("../models/user");
const otpModel = require("../models/otp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require('otp-generator');
const transporter = require("../config/nodemailer");
//const session = require('express-session');
const crypto = require('crypto');


// deterministic approach
// same output for same input
function deriveKey(masterPassword, salt) {
    return crypto.pbkdf2Sync(masterPassword, salt, 100000, 32, 'sha256');
}

// first factor => email, 2nd factor => otp
exports.login = async (req, res) => {
    try {
        // Get user data
        const { email, password } = req.body;

        // Check for registered user
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered",
            });
        }

        // Verify password
        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: "Wrong Password",
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
        });

        // Send OTP
        await transporter.sendMail({
            from: "Password Manager",
            to: email,
            subject: "This OTP will expire in 5 minutes",
            html: `<h2>Your OTP is</h2> <p>${otp}</p>`,
        });

        return res.status(200).json({
            success: true,
            message: "OTP sent to email",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Login failure",
        });
    }
};
exports.verifyLoginOTP = async(req,res) => {
    try {
        const { email, password, otp } = req.body;
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
        // save the encryption key in the session
        const user = await userModel.findOne({ email });
        const key = deriveKey(password, user.salt);
        req.session.encryptionKey = key.toString('hex');
        //generate a JWT token
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
              email: user.email,
              id: user._id,
            };
            let token = jwt.sign(payload, process.env.JWT_SECRET, {
              expiresIn: "2h",
            });
            res.status(200).json({
                success: true,
                token,
                message: "User logged in successfully",
            });
        }

    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
        success: false,
        message: "Login failure",
        });
    }
}