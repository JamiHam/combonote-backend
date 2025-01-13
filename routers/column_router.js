const jwt = require('jsonwebtoken')
const columnRouter = require('express').Router()
const { User, Note, Table, Column } = require('../models')
const { getTokenFrom } = require('../utils/authorization')

columnRouter.get('/:tableId', async (request, response, next) => {
  const table = await Table.findByPk(request.params.tableId, {
    include: {
      model: Column
    }
  })

  if (!table) {
    return response.status(404).send({ error: 'table does not exist' })
  }

  return response.send(table.columns)
})

columnRouter.post('/', async (request, response, next) => {
  let decodedToken = null
  try {
    decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  } catch (error) {
    return next(error)
  }

  const user = await User.findByPk(decodedToken.id)
  const table = await Table.findByPk(request.body.tableId)

  if (!table) {
    return response.status(404).send({ error: 'table does not exist' })
  }

  const note = await Note.findByPk(table.noteId)

  if (user.id !== note.userId) {
    return response.status(403).end()
  }

  const column = await Column.create(request.body)

  return response.status(201).json(column)
})

module.exports = columnRouter