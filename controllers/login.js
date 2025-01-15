const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { User } = require('../models')

const login = async (request, response) => {
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

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({
      token,
      username: user.username,
    })
}

module.exports = { login }