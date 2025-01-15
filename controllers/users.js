const bcrypt = require('bcrypt')
const { User } = require('../models')

const getUsers = async (request, response) => {
  const users = await User.findAll()
  response.json(users)
}

const getUser = async (request, response, next) => {
  try {
    const user = await User.findByPk(request.params.id)
    response.json(user)
  } catch (error) {
    next(error)
  }
}

const createUser = async (request, response, next) => {
  try {
    const { username, password } = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = await User.create({ username, passwordHash })
    response.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser
}