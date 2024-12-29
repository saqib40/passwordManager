const userModel = require("../models/user");
const otpModel = require("../models/otp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require('otp-generator');
const transporter = require("../config/nodemailer");
const session = require('express-session');
const crypto = require('crypto');

/*
exports.signup = async (req, res) => {
    try {
        //get user data
        const { username, email, password } = req.body;
        //check if user exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
              success: false,
              message: "User already exists",
            });
        }
        // create OTP
        const otp = otpGenerator.generate(8, {
            upperCase: true,
            lowerCase: true,
            digits: true,
        });
        //hash OTP
        let hashedOTP;
        try {
            hashedOTP = await bcrypt.hash(otp, 10);
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing otp",
            });
        }
        //save OTP
        await otpModel.create({
            email,
            otpHash: hashedOTP,
        });
        // send OTP
        let info = await transporter.sendMail({
            from: "Password Manager",
            to: email,
            subject: "This OTP will expire in 2 minutes",
            html: `<h2>Your OTP is</h2> <p>${otp}</p>`,
        });
        // verify OTP
        const otpFromDB = await otpModel.findOne({ hashedOTP }); // will return null if it's expired
        if (!(await bcrypt.compare(otp, otpFromDB.otpHash))) { // How can you verify OTP overhere??
            return res.status(500).json({
                success: false,
                message: "Wrong OTP",
            });
        }
        //secure the password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing password",
            });
        }
        //create entry for user in DB
        const user = await userModel.create({
            username,
            email,
            password: hashedPassword,
        });
        // if everything goes well
        // remove the OTP from database
        await otpModel.findOneAndDelete({otpHash: hashedOTP});
        return res.status(200).json({
            success: true,
            message: "User created successfully",
        });
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered, please try again later",
        });
    }
}
*/

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
            from: "Password Manager",
            to: email,
            subject: "This OTP will expire in 2 minutes",
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

function deriveKey(masterPassword, salt) {
    return crypto.pbkdf2Sync(masterPassword, salt, 100000, 32, 'sha256');
}

// first factor => email, 2nd factor => otp
/*
exports.login = async (req, res) => {
    try {
        //get user data
        const {email,password} = req.body;
        //check for registered user
        let user = await userModel.findOne({email});
        if (!user) {
          return res.status(401).json({
            success: false,
            message: "User is not registered",
          });
        }
        //verify password
        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(500).json({
                success: false,
                message: "Wrong Password",
            });
        }
        // otp as the second factor verification
        // create OTP
        const otp = otpGenerator.generate(8, {
            upperCase: true,
            lowerCase: true,
            digits: true,
        });
        //hash OTP
        let hashedOTP;
        try {
            hashedOTP = await bcrypt.hash(otp, 10);
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing otp",
            });
        }
        //save OTP
        await otpModel.create({
            email,
            otpHash: hashedOTP,
        });
        // send OTP
        let info = await transporter.sendMail({
            from: "Password Manager",
            to: email,
            subject: "This OTP will expire in 5 minutes",
            html: `<h2>Your OTP is</h2> <p>${otp}</p>`,
        });
        // verify OTP
        const otpFromDB = await otpModel.findOne({ hashedOTP }); // will return null if it's expired
        if (!(await bcrypt.compare(otp, otpFromDB.otpHash))) {
            return res.status(500).json({
                success: false,
                message: "Wrong OTP",
            });
        }
        // save the encryption key in the session
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
    catch(error) {
        console.log(error);
        return res.status(500).json({
        success: false,
        message: "Login failure",
        });
    }
}
*/
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