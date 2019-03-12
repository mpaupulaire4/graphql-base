module.exports = {
  type: 'sqljs',
  location: './database.db',
  synchronize: true,
  migrations: [
    'build/Migrations/**/*.js'
  ],
  entities: [
    'biuld/Data/**/*.entity.js'
  ],
  cli: {
    migrationsDir: 'src/Migrations'
  }
}
