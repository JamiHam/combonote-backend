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
  createNote,
  createTable,
  createColumn
} = require('./test_helper')

beforeEach(async () => {
  await User.truncate({ cascade: true })
})

describe('user', async () => {
  test('can be created with valid data', async () => {
    await api
      .post('/api/users')
      .send({ username: 'Alice', password: 'password' })
      .expect(201)
  })

  test('cannot be created if the username already exists', async () => {
    await createUser('Alice', 'password')
    
    await api
      .post('/api/users')
      .send({ username: 'Alice', password: 'password' })
      .expect(409)
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

  test('succeeds with correct username and password', async () => {
    await api
      .post('/api/login')
      .send({ username: 'Alice', password: 'password' })
      .expect(200)
  })
  
  test('fails with incorrect password', async () => {
    await api
      .post('/api/login')
      .send({ username: 'Alice', password: 'qwerty' })
      .expect(401)
  })

  test('fails with nonexistent username', async () => {
    await api
      .post('/api/login')
      .send({ username: 'Bob', password: 'password' })
      .expect(401)
  })

  test('fails with no username or password', async () => {
    await api
      .post('/api/login')
      .expect(401)
  })
})

describe('creating a new note', async () => {
  beforeEach(async () => {
    await createUser('Alice', 'password')
  })

  test('succeeds while logged in', async () => {
    const token = await getToken('Alice', 'password')

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

    describe('when there are columns in the database', async () => {
      beforeEach(async () => {
        const token = await getToken('Alice', 'password')

        await api
          .post('/api/columns')
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'column1', tableId })

        await api
          .post('/api/columns')
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'column2', tableId })
      })

      describe('fetching columns', async () => {
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
  })
})

/*describe('row', async () => {
  beforeEach(async () => {

  })

  test('cannot be created while not logged in', async () => {
    await api
      .post('/api/rows')
      .send({ tableId })
      .expect(401)
  })

  test('can be added while logged in as the correct user', async () => {
    const token = getToken('Alice', 'password')

    await api
      .post('/api/rows')
      .set('Authorization', `Bearer ${token}`)
      .send({ tableId })
      .expect(201)
  })

  test('cannot be added while logged in as the wrong user', async () => {
    const token = getToken('Bob', 'password')

    await api
      .post('/api/rows')
      .set('Authorization', `Bearer ${token}`)
      .send({ tableId })
      .expect(403)
  })

  test('cannot be added when the specified table does not exist', async () => {
    const token = getToken('Alice', 'password')
    tableId += 1

    await api
      .post('/api/rows')
      .set('Authorization', `Bearer ${token}`)
      .send({ tableId })
      .expect(404)
  })
})*/

after(async () => {
  await sequelize.close()
})