const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('method:', request.method)
  logger.info('path:  ', request.path)
  logger.info('body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.stack)
  
  switch(error.name) {
    case 'SequelizeUniqueConstraintError':
      return response.status(409).send({ error })
    case 'JsonWebTokenError':
      return response.status(401).send({ error })
    default:
      return response.status(400).send({ error })
  }
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}