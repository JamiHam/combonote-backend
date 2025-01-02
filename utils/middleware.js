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
  logger.error(error.message)

  switch (error.name) {
    
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}