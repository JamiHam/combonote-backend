const { test, beforeEach, describe, after, before } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const { sequelize } = require('../utils/db')
const { User } = require('../models')
const { getToken, createUser } = require('./test_helper')

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
  beforeEach(async () => {
    await api
      .post('/api/users')
      .send(newUser)
  })

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
        .send({ name: 'note' })
        .expect(201)
    })
  
    test ('fails while logged out', async () => {
      await api
        .post('/api/notes')
        .send({ name: 'note' })
        .expect(401)
    })
  })
})

describe('when there are two users and a note in the database', async () => {
  let noteId = null

  beforeEach(async () => {
    await createUser('Alice', 'password')
    await createUser('Bob', 'password')
    const token = await getToken('Alice', 'password')

    const response = await api
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'note' })

    noteId = response.body.id
  })

  describe('creating a new table', async () => {
    test('fails while not logged in', async () => {
      await api
        .post('/api/tables')
        .send({ name: 'table', noteId })
        .expect(401)
    })
  
    test('succeeds while logged in as the correct user', async () => {
      const token = await getToken('Alice', 'password')
  
      await api
        .post('/api/tables')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'table', noteId })
        .expect(201)
    })
  
    test('fails while logged in as the wrong user', async () => {
      const token = await getToken('Bob', 'password')
  
      await api
        .post('/api/tables')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'table', noteId })
        .expect(403)
    })
  
    test('fails when the selected note does not exist', async () => {
      const token = await getToken('Alice', 'password')
      noteId += 1
  
      await api
        .post('/api/tables')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'table', noteId })
        .expect(404)
    })
  })
  
  describe('when there is a table in the database', async () => {
    let tableId = null

    beforeEach(async () => {
      const token = await getToken('Alice', 'password')

      const response = await api
        .post('/api/tables')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'note', noteId })
      
      tableId = response.body.id
    })

    describe('adding a new column to a table', async () => {
      test('fails while not logged in', async () => {
        await api
          .post('/api/columns')
          .send({ name: 'column', tableId })
          .expect(401)
      })

      test('succeeds while logged in as the correct user', async () => {
        const token = await getToken('Alice', 'password')

        await api
          .post('/api/columns')
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'column', tableId })
          .expect(201)
      })

      test('fails while logged in as the wrong user', async () => {
        const token = await getToken('Bob', 'password')

        await api
          .post('/api/columns')
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'column', tableId })
          .expect(403)
      })

      test('fails when the selected table does not exist', async () => {
        const token = await getToken('Alice', 'password')
        tableId += 1

        await api
          .post('/api/columns')
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'column', tableId })
          .expect(404)
      })
    })
  })
})

after(async () => {
  await sequelize.close()
})