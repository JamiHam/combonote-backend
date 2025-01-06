const { test, beforeEach, describe, after, before } = require('node:test')
const assert = require('node:assert')
const request = require('supertest')
const app = require('../app')

const { sequelize } = require('../utils/db')
const { User } = require('../models')

const newUser = {
  username: 'Alice',
  password: 'password123'
}

beforeEach(async () => {
  await User.truncate({ cascade: true })
})

describe('creating a new user', async () => {
  test('succeeds with valid data', async () => {
    await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(201)
  })

  test('fails if the username already exists', async () => {
    await User.create({ username: 'Alice', passwordHash: 'passwordHash' })
    
    await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(409)
  })
})

test('passwords are not stored as plaintext', async () => {
  const createdUser = await request(app)
    .post('/api/users')
    .send(newUser)
  
  assert.notEqual(newUser.password, createdUser.body.passwordHash)
})

describe('login', async () => {
  beforeEach(beforeEach(async () => {
    await request(app)
      .post('/api/users')
      .send(newUser)
  }))

  test('succeeds with correct username and password', async () => {
    await request(app)
      .post('/api/login')
      .send({
        username: 'Alice',
        password: 'password123'
      })
      .expect(200)
  })
  
  test('fails with incorrect password', async () => {
    await request(app)
      .post('/api/login')
      .send({
        username: 'Alice',
        password: 'password321'
      })
      .expect(401)
  })
})

after(async () => {
  await sequelize.close()
})