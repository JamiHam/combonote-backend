const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')

const { User } = require('../models')

router.get('/', async (request, response) => {
  const users = await User.findAll()
  response.json(users)
})

router.get('/:id', async (request, response, next) => {
  try {
    const user = await User.findByPk(request.params.id)
    response.json(user)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (request, response, next) => {
  try {
    const { username, password } = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = await User.create({ username, passwordHash })
    response.json(user)
  } catch (error) {
    next(error)
  }
})

module.exports = router