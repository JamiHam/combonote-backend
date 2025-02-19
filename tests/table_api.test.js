const { beforeEach } = require('mocha');
const supertest = require('supertest');
const app = require('../app')
const api = supertest(app)

const {
  resetDatabase,
  createUser,
  getToken,
  createDocument
} = require('./test_helper')

describe('table', () => {
  let documentId = null

  beforeEach(async () => {
    await resetDatabase()
    await createUser('Alice', 'password')
    await createUser('Bob', 'password')
    const token = await getToken('Alice', 'password')
    documentId = (await createDocument('document', token)).body.id
  })

  describe('creation', () => {
    it('should fail while not logged in', async () => {
      await api
        .post(`/api/tables/${documentId}`)
        .send({ name: 'table' })
        .expect(401)
    })

    it('should fail while logged in as the wrong user', async () => {
      const token = await getToken('Bob', 'password')

      await api
        .post(`/api/tables/${documentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'table' })
        .expect(403)
    })

    it('should fail when the specified document does not exist', async () => {
      const token = await getToken('Alice', 'password')
      documentId += 1

      await api
        .post(`/api/tables/${documentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'table' })
        .expect(404)
    })

    it('should succeed while logged in as the correct user', async () => {
      const token = await getToken('Alice', 'password')

      await api
        .post(`/api/tables/${documentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'table' })
        .expect(201)
    })
  })
})