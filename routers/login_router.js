const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const { User } = require('../models')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  let passwordCorrect = false

  if (!username || !password) {
    return response.status(401).json({ error: 'invalid username or password' })
  }

  const user = await User.findOne({ where: { username: username } })

  if (user) {
    passwordCorrect = await bcrypt.compare(password, user.passwordHash)
  }

  if (!user || !passwordCorrect) {
    return response.status(401).json({ error: 'invalid username or password' })
  }

  const tokenUser = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(tokenUser, process.env.SECRET)

  response
    .status(200)
    .send({
      token,
      username: user.username,
    })
})

module.exports = loginRouter