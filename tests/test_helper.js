const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const getToken = async (username, password) => {
  const response = await api
    .post('/api/login')
    .send({ username, password })

  return response.body.token
}

const createUser = async (username, password) => {
  const response = await api
    .post('/api/users')
    .send({ username, password })
}

module.exports = {
  getToken,
  createUser,
}