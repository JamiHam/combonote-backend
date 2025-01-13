const jwt = require('jsonwebtoken')
const tableRouter = require('express').Router()
const { User, Note, Table } = require('../models')
const { getTokenFrom } = require('../utils/authorization')

tableRouter.get('/', async (request, response) => {
  const tables = await Table.findAll()
  response.json(tables)
})

tableRouter.post('/', async (request, response, next) => {
  let decodedToken = null
  try {
    decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  } catch (error) {
    return next(error)
  }

  const user = await User.findByPk(decodedToken.id)
  const note = await Note.findByPk(request.body.noteId)

  if (!note) {
    return response.status(404).send({ error: 'note does not exist' })
  }

  if (user.id !== note.userId) {
    return response.status(403).end()
  }

  const table = await Table.create(request.body)

  return response.status(201).json(table)
})

module.exports = tableRouter