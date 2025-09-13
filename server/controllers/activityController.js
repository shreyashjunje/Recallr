const Activity = require("../models/Activity");

const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(10); // last 10 activities

    res
      .status(200)
      .json({ message: "fetched activity successfully", data: activities });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch activity" });
  }
};

module.exports = { getActivities };
