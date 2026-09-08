const { BetaAnalyticsDataClient } = require("@google-analytics/data");

const analyticsClient =
  new BetaAnalyticsDataClient({
    keyFilename:
      process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });

const propertyId =
  process.env.GOOGLE_ANALYTICS_PROPERTY_ID;

async function runAnalyticsReport({
  dimensions = [],
  metrics = [],
  startDate = "7daysAgo",
  endDate = "today",
}) {
  const [response] =
    await analyticsClient.runReport({
      property: `properties/${propertyId}`,

      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],

      dimensions: dimensions.map((name) => ({
        name,
      })),

      metrics: metrics.map((name) => ({
        name,
      })),
    });

  return response;
}

module.exports = {
  analyticsClient,
  propertyId,
  runAnalyticsReport,
};