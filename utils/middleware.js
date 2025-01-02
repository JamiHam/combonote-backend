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
  logger.error(error.original.stack)

  switch(error.original.code) {
    case '22P02':
      return response.status(400).send({ error: 'malformatted id' })
    case '23505':
      return response.status(409).send({ error: 'username unavailable' })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}