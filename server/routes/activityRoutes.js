const express = require("express");
const { getActivities } = require("../controllers/activityController");
const router = express.Router();

router.get("/get-activity-log", getActivities);

module.exports = router;
