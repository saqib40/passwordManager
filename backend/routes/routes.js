const express = require("express");
const router = express.Router();

const {login, signup, verifyOTP, verifyLoginOTP} = require("../controllers/authA");
const {create, view, auth} = require("../protected/authB");

router.post("/verifyOTP", verifyOTP);
router.post("/verifyLoginOTP", verifyLoginOTP);
router.post("/login", login);
router.post("/signup", signup);

//router.delete("/remove/:Id", auth, remove);
router.post("/create", auth, create);
router.get("/view", auth, view);

module.exports = router;