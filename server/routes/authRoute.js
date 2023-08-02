const express = require("express");
const router = express.Router();
const {
    signIn,
    signUp
} = require("../controllers/authController");

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);

module.exports = router;
