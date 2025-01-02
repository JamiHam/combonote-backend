const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const logger = require('./logger')

const sequelize = new Sequelize(DATABASE_URL)

const connect = async () => {
  try {
    await sequelize.authenticate()
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