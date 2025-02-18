const { beforeEach, after } = require('mocha')
const assert = require('node:assert')

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const { sequelize } = require('../utils/db')

const { User } = require('../models')
const { createUser } = require('./test_helper')

beforeEach(async () => {
  await User.truncate({ cascade: true })
})

describe('user', () => {
  describe('create', () => {
    it('should fail if the username already exists',  async () => {
      await createUser('Alice', 'password')
      
      await api
        .post('/api/users')
        .send({ username: 'Alice', password: 'password' })
        .expect(409)
    })

    it('should succeed with with valid data', async () => {
      await api
        .post('/api/users')
        .send({ username: 'Alice', password: 'password' })
        .expect(201)
    })
  })

  describe('passwords', () => {
    it('should not be stored as plaintext', async () => {
      const createdUser = await api
        .post('/api/users')
        .send({ username: 'Alice', password: 'password' })
      assert.notEqual(createdUser.body.passwordHash, 'password')
    })
  })
})

after(async () => {
  await User.truncate({ cascade: true })
})