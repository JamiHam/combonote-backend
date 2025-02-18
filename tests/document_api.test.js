const { beforeEach, after } = require('mocha');
const assert = require('node:assert')

const supertest = require('supertest');
const app = require('../app')
const api = supertest(app)
const { sequelize } = require('../utils/db')

const { User, Document } = require('../models')
const {
  createUser,
  getToken,
  createDocument
} = require('./test_helper')

beforeEach(async () => {
  await User.truncate({ cascade: true })
})

describe('document', () => {
  beforeEach(async () => {
    await createUser('Alice', 'password')
  })

  describe('creation', () => {
    it('should succeed while logged in', async () => {
      const token = await getToken('Alice', 'password')
  
      await api
        .post('/api/documents')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'document' })
        .expect(201)
    })

    it('should fail while logged out', async () => {
      await api
        .post('/api/documents')
        .send({ name: 'document' })
        .expect(401)
    })

    it('should fail if name is not provided', async () => {
      const token = await getToken('Alice', 'password')
  
      await api
        .post('/api/documents')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })
  })

  describe('fetching', async () => {
    beforeEach(async () => {
      await createUser('Bob', 'password')

      let token = await getToken('Alice', 'password')
      await createDocument("Alice's document", token)

      token = await getToken('Bob', 'password')
      await createDocument("Bob's document", token)
    })

    it('should succeed with documents created by the logged in user', async () => {
      let token = await getToken('Alice', 'password')

      let documents = await api
        .get('/api/documents/Alice')
        .set('Authorization', `Bearer ${token}`)

      assert.strictEqual(documents.body.length, 1)
      assert.equal(documents.body[0].name, "Alice's document")

      token = await getToken('Bob', 'password')

      documents = await api
        .get('/api/documents/Bob')
        .set('Authorization', `Bearer ${token}`)

      assert.strictEqual(documents.body.length, 1)
      assert.equal(documents.body[0].name, "Bob's document")
    })

    it('should fail while logged in as the wrong user', async () => {
      const token = await getToken('Alice', 'password')

      await api
        .get('/api/documents/Bob')
        .set('Authorization', `Bearer ${token}`)
        .expect(403)
    })

    it('should fail while not logged in', async () => {
      const documents = await api
        .get('/api/documents/Alice')
        .expect(401)
    })
  })
})

after(async () => {
  await User.truncate({ cascade: true })
})