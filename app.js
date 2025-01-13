const express = require('express')
const app = express()

const { PORT } = require('./utils/config')
const { connect } = require('./utils/db')
const middleware = require('./utils/middleware')
const {
  userRouter,
  loginRouter,
  noteRouter,
  tableRouter,
  columnRouter
} = require('./routers')

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/notes', noteRouter)
app.use('/api/tables', tableRouter)
app.use('/api/columns', columnRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const start = async () => {
  await connect()
}

start()

module.exports = app