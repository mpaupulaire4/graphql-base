module.exports = {
  "type": "sqljs",
  "location": "./database.db",
  "autoSave": true,
  "synchronize": true,
  "logging": false,
  "migrations": [
    "build/Migrations/**/*.js"
  ],
  "cli": {
    "migrationsDir": "src/Migrations"
  }
}
