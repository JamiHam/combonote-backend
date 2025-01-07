const Sequelize = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')

const { DATABASE_URL } = require('./config')
const logger = require('./logger')

const sequelize = new Sequelize(DATABASE_URL)

const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob:'migrations/*.js',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console
  })
  const migrations = await migrator.up()
  logger.info('Migrations up to date', {
    files: migrations.map((mig) => mig.name)
  })
}

const connect = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    logger.info('connected to database')
  } catch (error) {
    logger.error('database connection failed:', error)
    return process.exit(1)
  }

  return null
}

module.exports = {
  connect,
  sequelize
}