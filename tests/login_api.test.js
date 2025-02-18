const { beforeEach, after } = require('mocha');

const supertest = require('supertest');
const app = require('../app')
const api = supertest(app)
const { sequelize } = require('../utils/db')

const { User } = require('../models')
const { createUser } = require('./test_helper')

beforeEach(async () => {
  await User.truncate({ cascade: true })
})

describe('login', () => {
  beforeEach(async () => {
    await createUser('Alice', 'password')
  })

  it('should fail when username and password are not provided', async () => {
    await api
      .post('/api/login')
      .expect(401)
  })

  it('should fail when username is not provided', async () => {
    await api
      .post('/api/login')
      .send({ username: 'Bob', password: 'password' })
      .expect(401)
  })

  it('should fail when password is not provided', async () => {
    await api
      .post('/api/login')
      .send({ username: 'Alice', password: 'qwerty' })
      .expect(401)
  })

  it('should succeed with correct username and password', async () => {
    await api
      .post('/api/login')
      .send({ username: 'Alice', password: 'password' })
      .expect(200)
  })
})

after(async () => {
  await User.truncate({ cascade: true })
})