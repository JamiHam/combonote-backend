const express = require('express')
const app = express()

const { PORT } = require('./utils/config')
const { connect } = require('./utils/db')
const middleware = require('./utils/middleware')
const router = require('./routers')

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/', router)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const start = async () => {
  await connect()
}

start()

module.exports = app