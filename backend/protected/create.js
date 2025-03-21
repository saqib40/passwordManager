const docModel = require("../models/docs");
const crypto = require('crypto');

function encrypt(text, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

exports.create = async (req,res) => {
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