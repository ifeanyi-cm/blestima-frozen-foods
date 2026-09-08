const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { runAnalyticsReport } = require("../services/googleAnalytics");

router.get("/overview", auth, async (req, res) => {
  try {
    let startDate = req.query.startDate || "7daysAgo";
const endDate = req.query.endDate || "today";

if (startDate === "monthStart") {
  const now = new Date();

  startDate = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-01`;
}

    const response = await runAnalyticsReport({
      startDate,
      endDate,
      metrics: [
        "activeUsers",
        "newUsers",
        "sessions",
        "screenPageViews",
        "addToCarts",
        "checkouts",
      ],
    });

    const row = response.rows?.[0];

    const values = row?.metricValues || [];

    res.json({
      success: true,
      startDate,
      endDate,
      overview: {
        activeUsers: Number(values[0]?.value || 0),
        newUsers: Number(values[1]?.value || 0),
        sessions: Number(values[2]?.value || 0),
        pageViews: Number(values[3]?.value || 0),
        addToCart: Number(values[4]?.value || 0),
        checkoutStarts: Number(values[5]?.value || 0),
      },
    });
  } catch (error) {
    console.error(
      "Analytics overview error:",
      error
    );

    res.status(500).json({
      success: false,
      error: "Failed to fetch analytics overview",
    });
  }
});

module.exports = router;