const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connect } = require('./util/db')

app.use(express.json())

const start = async () => {
  await connect()
  app.listen(PORT, () => {
    console.log('Server running on port', PORT)
  })
}

start()