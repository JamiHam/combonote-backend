const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const { User, Document, Table, Column, Row, Data } = require('../models')

const resetDatabase = async () => {
  await Data.destroy({ where: {}})
  await Row.destroy({ where: {}})
  await Column.destroy({ where: {}})
  await Table.destroy({ where: {}})
  await Document.destroy({ where: {}})
  await User.destroy({ where: {}})
}

const getToken = async (username, password) => {
  const response = await api
    .post('/api/login')
    .send({ username, password })

  return response.body.token
}

const createUser = async (username, password) => {
  return await api
    .post('/api/users')
    .send({ username, password })
}

const createDocument = async (name, token) => {
  return await api
    .post('/api/documents')
    .set('Authorization', `Bearer ${token}`)
    .send({ name })
}

const createTable = async (name, documentId, token) => {
  return await api
    .post(`/api/tables/${documentId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ name })
}

const createColumn = async (name, tableId, token) => {
  return await api
    .post(`/api/columns/${tableId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ name })
}

const createRow = async (tableId, token) => {
  return await api
    .post(`/api/rows/${tableId}`)
    .set('Authorization', `Bearer ${token}`)
}

module.exports = {
  resetDatabase,
  getToken,
  createUser,
  createDocument,
  createTable,
  createColumn,
  createRow
}