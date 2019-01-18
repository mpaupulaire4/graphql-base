module.exports = {
   "type": "sqljs",
   "location": "./database.db",
   "autoSave": true,
   "synchronize": true,
   "logging": false,
   "migrations": [
      "src/Migrations/**/*.ts"
   ],
   "cli": {
      "migrationsDir": "src/Migrations"
   }
}