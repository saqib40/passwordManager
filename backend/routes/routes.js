const express = require("express");
const router = express.Router();

const {login, verifyLoginOTP} = require("../controllers/login");
const {signup, verifyOTP} = require("../controllers/signup");

const auth = require("../protected/auth");
const create = require("../protected/create");
const view = require("../protected/view");
const remove = require("../protected/remove");

router.post("/verifyOTP", verifyOTP); // during signup
router.post("/verifyLoginOTP", verifyLoginOTP); // during login
router.post("/login", login);
router.post("/signup", signup);

//router.delete("/remove/:Id", auth, remove);
router.post("/create", auth, create);
router.get("/view", auth, view);

module.exports = router;