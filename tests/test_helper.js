const { User } = require('../models')

const initialUsers = [
  {
    username: 'Alice',
    password: 'password123'
  },
  {
    username: 'Bob',
    password: 'qwerty'
  }
]

module.exports = {
  initialUsers
}