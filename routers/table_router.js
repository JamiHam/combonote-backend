const tableRouter = require('express').Router()
const { User, Note, Table } = require('../models')
const { authorization } = require('../utils/auth')

tableRouter.get('/', async (request, response) => {
  const tables = await Table.findAll()
  response.json(tables)
})

tableRouter.post('/', authorization, async (request, response, next) => {
  const user = await User.findByPk(request.decodedToken.id)
  const note = await Note.findByPk(request.body.noteId)

  if (!note) {
    return response.status(404).json({ error: 'note does not exist' })
  }

  if (user.id !== note.userId) {
    return response.status(403).end()
  }

  const table = await Table.create(request.body)

  response.status(201).json(table)
})

module.exports = tableRouter