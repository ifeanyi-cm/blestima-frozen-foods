const fs = require("fs");
const path = require("path");

function backupDatabase() {
  const dbPath = path.join(__dirname, "../../prisma/dev.db");
 const backupFolder = path.resolve(
  process.cwd(),
  process.env.BACKUP_FOLDER || "src/backups"
);
  if (!fs.existsSync(dbPath)) {
    console.log("Database not found. Backup skipped.");
    return;
  }

  if (!fs.existsSync(backupFolder)) {
    fs.mkdirSync(backupFolder, { recursive: true });
  }

  const now = new Date();

  const fileName = `backup-${
    now.getFullYear()
  }-${String(now.getMonth() + 1).padStart(2, "0")}-${
    String(now.getDate()).padStart(2, "0")
  }_${String(now.getHours()).padStart(2, "0")}-${
    String(now.getMinutes()).padStart(2, "0")
  }.db`;

  const destination = path.join(backupFolder, fileName);

  fs.copyFileSync(dbPath, destination);

  console.log(`Database backup created: ${fileName}`);

  // Keep only the newest 7 backups
  const backups = fs
    .readdirSync(backupFolder)
    .filter(file => file.endsWith(".db"))
    .map(file => ({
      file,
      time: fs.statSync(path.join(backupFolder, file)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time);

 const retention = parseInt(process.env.BACKUP_RETENTION || "7", 10);

if (backups.length > retention) {
  backups.slice(retention).forEach(oldBackup => {
    fs.unlinkSync(path.join(backupFolder, oldBackup.file));
    console.log(`Deleted old backup: ${oldBackup.file}`);
  });
}
}

module.exports = backupDatabase;