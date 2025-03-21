const crypto = require('crypto');
const userModel = require("../models/user");

function decrypt(text, key) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

exports.view = async (req,res) => {
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