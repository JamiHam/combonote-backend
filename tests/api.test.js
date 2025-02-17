const { test, beforeEach, describe, after, before } = require('node:test')
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

describe('user', async () => {
  test('cannot be created if the username already exists', async () => {
    await createUser('Alice', 'password')
    
    await api
      .post('/api/users')
      .send({ username: 'Alice', password: 'password' })
      .expect(409)
  })

  test('can be created with valid data', async () => {
    await api
      .post('/api/users')
      .send({ username: 'Alice', password: 'password' })
      .expect(201)
  })

  test('passwords are not stored as plaintext', async () => {
    const createdUser = await api
      .post('/api/users')
      .send({ username: 'Alice', password: 'password' })
    
    assert.notEqual(createdUser.body.passwordHash, 'password')
  })
})

describe('login', async () => {
  beforeEach(async () => {
    await createUser('Alice', 'password')
  })

  test('fails with no username or password', async () => {
    await api
      .post('/api/login')
      .expect(401)
  })

  test('fails with nonexistent username', async () => {
    await api
      .post('/api/login')
      .send({ username: 'Bob', password: 'password' })
      .expect(401)
  })

  test('fails with incorrect password', async () => {
    await api
      .post('/api/login')
      .send({ username: 'Alice', password: 'qwerty' })
      .expect(401)
  })

  test('succeeds with correct username and password', async () => {
    await api
      .post('/api/login')
      .send({ username: 'Alice', password: 'password' })
      .expect(200)
  })
})

describe('document', async () => {
  beforeEach(async () => {
    await createUser('Alice', 'password')
  })

  test('can be created while logged in', async () => {
    const token = await getToken('Alice', 'password')

    await api
      .post('/api/documents')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'document' })
      .expect(201)
  })

  test ('cannot be created while logged out', async () => {
    await api
      .post('/api/documents')
      .send({ name: 'document' })
      .expect(401)
  })

  test('cannot be created if name is not provided', async () => {
    const token = await getToken('Alice', 'password')

    await api
      .post('/api/documents')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
  })

  describe('fetching', async () => {
    beforeEach(async () => {
      await createUser('Bob', 'password')

      let token = await getToken('Alice', 'password')
      createDocument("Alice's document", token)

      token = await getToken('Bob', 'password')
      createDocument("Bob's document", token)
    })

    test('succeeds with documents created by the logged in user', async () => {
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

    test('fails while logged in as the wrong user', async () => {
      const token = await getToken('Alice', 'password')

      await api
        .get('/api/documents/Bob')
        .set('Authorization', `Bearer ${token}`)
        .expect(403)
    })

    test('fails while not logged in', async () => {
      const documents = await api
        .get('/api/documents/Alice')
        .expect(401)
    })
  })
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
})