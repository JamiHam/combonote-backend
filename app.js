const express = require('express')
const app = express()

const { PORT } = require('./utils/config')
const { connect } = require('./utils/db')
const userRouter = require('./routers/userRouter')
const middleware = require('./utils/middleware')

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/users', userRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
app.use(middleware.sequelizeErrorHandler)

const start = async () => {
  await connect()
}

start()

module.exports = app