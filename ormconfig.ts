module.exports = {
  type: 'sqljs',
  location: './database.db',
  synchronize: true,
  autoSave: true,
  migrations: [
    'build/Migrations/**/*.js'
  ],
  cli: {
    migrationsDir: 'src/Migrations'
  }
}
