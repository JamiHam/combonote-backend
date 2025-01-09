const { test, beforeEach, describe, after, before } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

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

describe('when there is a user in the database', async () => {

  beforeEach(beforeEach(async () => {
    await api
      .post('/api/users')
      .send(newUser)
  }))

  describe('login', async () => {

    test('succeeds with correct username and password', async () => {
      await api
        .post('/api/login')
        .send({
          username: 'Alice',
          password: 'password123'
        })
        .expect(200)
    })
    
    test('fails with incorrect password', async () => {
      await api
        .post('/api/login')
        .send({
          username: 'Alice',
          password: 'password321'
        })
        .expect(401)
    })
  })

  describe('creating a new note', async () => {

    test('succeeds while logged in', async () => {
      const response = await api
        .post('/api/login')
        .send({
          username: 'Alice',
          password: 'password123'
        })

      const token = response.body.token

      await api
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'test_note' })
        .expect(201)
    })
  
    test ('fails while logged out', async () => {
      await api
        .post('/api/notes')
        .send({ name: 'test_note' })
        .expect(400)
    })
  })
})

after(async () => {
  await sequelize.close()
})