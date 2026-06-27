require("dotenv").config();

const validateEnv = require("./config/validateEnv");

// Validate environment variables before starting the server
validateEnv();

const express = require("express");
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");

const backupDatabase = require("./utils/backupDatabase");

const authRoutes =
  require("./routes/authRoutes");

const productRoutes =
  require("./routes/productRoutes");

const orderRoutes =
  require("./routes/orderRoutes");

const settingsRoutes =
  require("./routes/settingsRoutes");

const app = express();
/*
|--------------------------------------------------------------------------
| MIDDLEWARE
|--------------------------------------------------------------------------
*/

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {

      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

/*
|--------------------------------------------------------------------------
| STATIC FILES
|--------------------------------------------------------------------------
*/

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )

);

/*
|--------------------------------------------------------------------------
| API ROUTES
|--------------------------------------------------------------------------
*/

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/settings",
  settingsRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

/*
|--------------------------------------------------------------------------
| HOME ROUTE
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {

  res.json({
    success: true,
    message:
      "Blestima backend is running",
  });

});

/*
|--------------------------------------------------------------------------
| START SERVER
|--------------------------------------------------------------------------
*/

// Backup database every day at 2:00 AM
cron.schedule(process.env.BACKUP_SCHEDULE, () => {

  console.log(
    "Running scheduled database backup..."
  );

  backupDatabase();

});

console.log(
  `Automatic database backup scheduled: ${process.env.BACKUP_SCHEDULE}`
);

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {

  console.log(
    `Server running on port ${PORT}`
  );

});