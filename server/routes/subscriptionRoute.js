const express = require("express");
const router = express.Router();
const {
    dailyUpdate,
    subscribeCurrency,
    removeSubscription
} = require("../controllers/subscriptionController");

router.route("/subscribe").post(dailyUpdate);
router.route("/subscribe/currency").post(subscribeCurrency);
router.route("/remove/subscribe").post(removeSubscription);

module.exports = router;