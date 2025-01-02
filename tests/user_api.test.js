const { test, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const { User } = require('../models')

const newUser = {
  username: 'Alice',
  password: 'password123'
}

beforeEach(async () => {
  await User.truncate()
})

describe('creating a new user', async () => {
  test('succeeds with valid data', async () => {
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
  })

  test('fails if the username already exists', async () => {
    await User.create({ username: 'Alice', passwordHash: 'passwordHash' })

    await api
      .post('/api/users')
      .send(newUser)
      .expect(409)
  })
})


test('passwords are not stored as plaintext', async () => {
  const createdUser = await api
    .post('/api/users')
    .send(newUser)
  
  assert.notEqual(newUser.password, createdUser.body.passwordHash)
})