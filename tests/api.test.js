/*const { test, beforeEach, describe, after, before } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const { sequelize } = require('../utils/db')
const { User } = require('../models')
const {
  getToken,
  createUser,
  createDocument,
  createTable,
  createColumn,
  createRow
} = require('./test_helper')

beforeEach(async () => {
  await User.truncate({ cascade: true })
})

describe('table', async () => {
  let documentId = null

  beforeEach(async () => {
    await createUser('Alice', 'password')
    await createUser('Bob', 'password')
    const token = await getToken('Alice', 'password')
    documentId = (await createDocument('document', token)).body.id
  })

  test('cannot be created while not logged in', async () => {
    await api
      .post(`/api/tables/${documentId}`)
      .send({ name: 'table' })
      .expect(401)
  })

  test('cannot be created while logged in as the wrong user', async () => {
    const token = await getToken('Bob', 'password')

    await api
      .post(`/api/tables/${documentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'table' })
      .expect(403)
  })

  test('cannot be created when the specified document does not exist', async () => {
    const token = await getToken('Alice', 'password')
    documentId += 1

    await api
      .post(`/api/tables/${documentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'table' })
      .expect(404)
  })

  test('can be created while logged in as the correct user', async () => {
    const token = await getToken('Alice', 'password')

    await api
      .post(`/api/tables/${documentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'table' })
      .expect(201)
  })
})

describe('column', async () => {
  let documentId = null
  let tableId = null

  beforeEach(async () => {
    await createUser('Alice', 'password')
    await createUser('Bob', 'password')
    const token = await getToken('Alice', 'password')
    documentId = (await createDocument('document', token)).body.id
    tableId = (await createTable('table', documentId, token)).body.id
  })

  test('cannot be created while not logged in', async () => {
    await api
      .post(`/api/columns/${tableId}`)
      .send({ name: 'column' })
      .expect(401)
  })

  test('cannot be created while logged in as the wrong user', async () => {
    const token = await getToken('Bob', 'password')

    await api
      .post(`/api/columns/${tableId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'column' })
      .expect(403)
  })

  test('cannot be created when the selected table does not exist', async () => {
    const token = await getToken('Alice', 'password')
    tableId += 1

    await api
      .post(`/api/columns/${tableId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'column' })
      .expect(404)
  })

  test('can be created while logged in as the correct user', async () => {
    const token = await getToken('Alice', 'password')

    await api
      .post(`/api/columns/${tableId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'column' })
      .expect(201)
  })

  describe('fetching columns', async () => {
    beforeEach(async () => {
      const token = await getToken('Alice', 'password')
      await createColumn('column1', tableId, token)
      await createColumn('column2', tableId, token)
    })
    
    test('succeeds when table exists', async () => {
      const response = await api.get(`/api/columns/${tableId}`)

      assert.strictEqual(response.body.length, 2)
      assert.strictEqual(response.body[0].name, 'column1')
      assert.strictEqual(response.body[1].name, 'column2')
    })

    test('fails when table does not exist', async () => {
      tableId += 1

      await api
        .get(`/api/columns/${tableId}`)
        .expect(404)
    })
  })
})

describe('row', async () => {
  let documentId = null
  let tableId = null
  
  beforeEach(async () => {
    await createUser('Alice', 'password')
    await createUser('Bob', 'password')
    const token = await getToken('Alice', 'password')
    documentId = (await createDocument('document', token)).body.id
    tableId = (await createTable('table', documentId, token)).body.id
  })

  test('cannot be created while not logged in', async () => {
    await api
      .post(`/api/rows/${tableId}`)
      .expect(401)
  })

  test('can be added while logged in as the correct user', async () => {
    const token = await getToken('Alice', 'password')

    await api
      .post(`/api/rows/${tableId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
  })

  test('cannot be added while logged in as the wrong user', async () => {
    const token = await getToken('Bob', 'password')

    await api
      .post(`/api/rows/${tableId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
  })

  test('cannot be added when the specified table does not exist', async () => {
    const token = await getToken('Alice', 'password')
    tableId += 1

    await api
      .post(`/api/rows/${tableId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })

  describe('editing fields', async () => {
    let columnId = null
    let rowId = null

    beforeEach(async () => {
      const token = await getToken('Alice', 'password')
      columnId = (await createColumn('column', tableId, token)).body.id
      rowId = (await createRow(tableId, token)).body.id
    })

    test('fails when not logged in', async () => {
      await api
        .put(`/api/rows/${rowId}/${columnId}`)
        .send({ value: 'value' })
        .expect(401)
    })

    test('fails as the wrong user', async () => {
      const token = await getToken('Bob', 'password')

      await api
        .put(`/api/rows/${rowId}/${columnId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ value: 'value' })
        .expect(403)
    })

    test('fails when no value is provided', async () => {
      const token = await getToken('Alice', 'password')

      await api
        .put(`/api/rows/${rowId}/${columnId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })

    test('succeeds with valid data when logged in as the correct user', async () => {
      const token = await getToken('Alice', 'password')

      await api
        .put(`/api/rows/${rowId}/${columnId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ value: 'value' })
        .expect(200)
    })
  })
})

after(async () => {
  await sequelize.close()
})*/