const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const docModel = require("../models/docs");
const crypto = require('crypto');

function decrypt(text, key) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
function encrypt(text, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

exports.auth = async (req,res,next) => {
    try{
        const token = req.header("Authorization").replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({
                success:false,
                message:"Token missing",
            });
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const isTokenExpired = decoded.exp < Date.now() / 1000;
        if (isTokenExpired) {
            return res.status(401).json({
                success: false,
                message: "Token has expired",
            });
        }
        req.user = decoded;
        next();
    }
    catch(error){
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifying the user",
        });
    }
}

exports.view = async (req,res,next) => {
    try{
        // look for user
        const userId = req.user.id;
        // populate it's docs
        const userWithDocs = await userModel
         .findById(userId)
         .populate('docs');
        // get encryption key
        encryptionKey = Buffer.from(req.session.encryptionKey, 'hex');
        // Decrypt each document's password
        const userDocs = userWithDocs.docs.map(doc => {
            return {
                title: doc.title,
                password: decrypt(doc.password, encryptionKey)
            };
        });
        res.status(200).json({
            success: true,
            message: "Passwords retrieved successfully",
            data: userDocs,
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            data: "Internal server error",
            message: error.message,
        });
    }
}

exports.create = async (req,res,next) => {
    try {
        //get the data
        const {title, password} = req.body;
        // get encryption key
        if (!req.session.encryptionKey) {
            return res.sendStatus(401);
        }
        encryptionKey = Buffer.from(req.session.encryptionKey, 'hex');
        // encrypt
        const encryptedPassword = encrypt(password, encryptionKey);
        // create an entry in DB
        await docModel.create({
            title,
            password: encryptedPassword,
        });
        res.status(200).json({
            success: true,
            message: "Password saved successfully",
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            data: "Internal server error",
            message: error.message,
        });
    }
}
/* no time today, will implement in future
exports.remove = async (req,res,next) => {
    try{

    }
    catch(error){
        res.status(500).json({
            success: false,
            data: "Internal server error",
            message: error.message,
        });
    }
}
*/