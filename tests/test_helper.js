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
  await api
    .post('/api/users')
    .send({ username, password })
}

const createNote = async (name, token) => {
  return await api
    .post('/api/notes')
    .set('Authorization', `Bearer ${token}`)
    .send({ name })
}

const createTable = async (name, noteId, token) => {
  return await api
    .post('/api/tables')
    .set('Authorization', `Bearer ${token}`)
    .send({ name, noteId })
}

const createColumn = async (name, tableId, token) => {
  return await api
    .post('/api/columns')
    .set('Authorization', `Bearer ${token}`)
    .send({ name, tableId })
}

const createRow = async (tableId, token) => {
  return await api
    .post('/api/rows')
    .set('Authorization', `Bearer ${token}`)
    .send({ tableId })
}

module.exports = {
  getToken,
  createUser,
  createNote,
  createTable,
  createColumn,
  createRow
}