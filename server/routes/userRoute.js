const express = require("express");
const router = express.Router();
const { details } = require("../controllers/userController");

router.route("/details").post(details);

module.exports = router;