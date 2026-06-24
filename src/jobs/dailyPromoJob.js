const cron = require("node-cron");

const {
  createDailyPromo,
} = require("../services/promoService");

function startDailyPromoJob() {

  console.log("Daily promo scheduler started ✅");

  cron.schedule("* * * * *", async () => {

    console.log("Running promo job...");

    try {

      await createDailyPromo();

    } catch (error) {

      console.error(error.message);
    }
  });
}

module.exports = {
  startDailyPromoJob,
};