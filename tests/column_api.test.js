const { beforeEach } = require('mocha')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const {
  resetDatabase,
  createUser,
  getToken,
  createDocument,
  createTable,
  createColumn
} = require('./test_helper')

describe('column', () => {
  let documentId = null
  let tableId = null

  beforeEach(async () => {
    await resetDatabase()
    await createUser('Alice', 'password')
    await createUser('Bob', 'password')
    const token = await getToken('Alice', 'password')
    documentId = (await createDocument('document', token)).body.id
    tableId = (await createTable('table', documentId, token)).body.id
  })

  describe('creation', () => {
    it('should fail while logged out', async () => {
      await api
        .post(`/api/columns/${tableId}`)
        .send({ name: 'column' })
        .expect(401)
    })
  
    it('should fail while logged in as the wrong user', async () => {
      const token = await getToken('Bob', 'password')
  
      await api
        .post(`/api/columns/${tableId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'column' })
        .expect(403)
    })
  
    it('should fail when the selected table does not exist', async () => {
      const token = await getToken('Alice', 'password')
      tableId += 1
  
      await api
        .post(`/api/columns/${tableId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'column' })
        .expect(404)
    })
  
    it('should succeed while logged in as the correct user', async () => {
      const token = await getToken('Alice', 'password')
  
      await api
        .post(`/api/columns/${tableId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'column' })
        .expect(201)
    })
  })

  describe('fetching', () => {
    beforeEach(async () => {
      const token = await getToken('Alice', 'password')
      await createColumn('column1', tableId, token)
      await createColumn('column2', tableId, token)
    })
    
    it('should succeed when table exists', async () => {
      const response = await api.get(`/api/columns/${tableId}`)

      assert.strictEqual(response.body.length, 2)
      assert.strictEqual(response.body[0].name, 'column1')
      assert.strictEqual(response.body[1].name, 'column2')
    })

    it('should fail when table does not exist', async () => {
      tableId += 1

      await api
        .get(`/api/columns/${tableId}`)
        .expect(404)
    })
  })
})