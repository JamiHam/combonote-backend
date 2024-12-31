const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connect } = require('./util/db')
const userRouter = require('./routers/userRouter')

app.use(express.json())
app.use('/api/users', userRouter)

const start = async () => {
  await connect()
  app.listen(PORT, () => {
    console.log('Server running on port', PORT)
  })
}

start()