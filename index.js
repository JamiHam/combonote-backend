const express = require('express')
const app = express()

const { PORT } = require('./util/config')

app.use(express.json())

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})