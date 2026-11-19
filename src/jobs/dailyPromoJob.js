const cron = require("node-cron");

const {
  createDailyPromo,
} = require("../services/promoService");

let isRunning = false;

function startDailyPromoJob() {
  const schedule = process.env.SOCIAL_POST_SCHEDULE || "0 9,18 * * *";
  const timezone = process.env.SOCIAL_POST_TIMEZONE || "Africa/Lagos";

  if (!cron.validate(schedule)) {
    throw new Error(`Invalid SOCIAL_POST_SCHEDULE cron expression: ${schedule}`);
  }

  console.log(`Social media scheduler configured: ${schedule} (${timezone})`);

  return cron.schedule(
    schedule,
    async () => {
      if (isRunning) {
        console.warn("Social post job skipped because the previous run is still in progress.");
        return;
      }

      isRunning = true;
      console.log("Starting scheduled social media promo...");

      try {
        await createDailyPromo();
      } catch (error) {
        console.error("Scheduled social media promo failed:", error.message);
      } finally {
        isRunning = false;
      }
    },
    { timezone }
  );
}

module.exports = {
  startDailyPromoJob,
};
