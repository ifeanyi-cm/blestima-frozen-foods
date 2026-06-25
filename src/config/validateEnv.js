const requiredVariables = [
  "DATABASE_URL",
  "JWT_SECRET",
  "FRONTEND_URL",
  "BACKUP_SCHEDULE",
  "BACKUP_FOLDER",
  "BACKUP_RETENTION",
];

function validateEnv() {
  const missing = requiredVariables.filter(
    (name) => !process.env[name]
  );

  if (missing.length > 0) {
    console.error("\n❌ Missing environment variables:\n");

    missing.forEach((name) => {
      console.error(` - ${name}`);
    });

    console.error("\nServer startup cancelled.\n");

    process.exit(1);
  }

  console.log("✅ Environment variables loaded successfully.");
}

module.exports = validateEnv;