const { beforeEach } = require('mocha')

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const {
  resetDatabase,
  getToken,
  createUser,
  createDocument,
  createTable,
  createColumn,
  createRow
} = require('./test_helper')

describe('row', () => {
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
        .post(`/api/rows/${tableId}`)
        .expect(401)
    })
  
    it('should succeed while logged in as the document owner', async () => {
      const token = await getToken('Alice', 'password')
  
      await api
        .post(`/api/rows/${tableId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
    })
  
    it('should fail while not logged in as the document owner', async () => {
      const token = await getToken('Bob', 'password')
  
      await api
        .post(`/api/rows/${tableId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403)
    })
  
    it('should fail when the specified table does not exist', async () => {
      const token = await getToken('Alice', 'password')
      tableId += 1
  
      await api
        .post(`/api/rows/${tableId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
    })
  })

  describe('editing data', async () => {
    let columnId = null
    let rowId = null

    beforeEach(async () => {
      const token = await getToken('Alice', 'password')
      columnId = (await createColumn('column', tableId, token)).body.id
      rowId = (await createRow(tableId, token)).body.id
    })

    it('should fail when logged out', async () => {
      await api
        .put(`/api/rows/${rowId}/${columnId}`)
        .send({ value: 'value' })
        .expect(401)
    })

    it('should fail when not logged in as the document owner', async () => {
      const token = await getToken('Bob', 'password')

      await api
        .put(`/api/rows/${rowId}/${columnId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ value: 'value' })
        .expect(403)
    })

    it('should fail when no value is provided', async () => {
      const token = await getToken('Alice', 'password')

      await api
        .put(`/api/rows/${rowId}/${columnId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })

    it('should succeed with valid data when logged in as the document owner', async () => {
      const token = await getToken('Alice', 'password')

      await api
        .put(`/api/rows/${rowId}/${columnId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ value: 'value' })
        .expect(200)
    })
  })
})