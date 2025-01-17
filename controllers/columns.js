const { User, Note, Table, Column } = require('../models')

const getColumns = async (request, response, next) => {
  const table = await Table.findByPk(request.params.tableId, {
    include: {
      model: Column
    }
  })

  if (!table) {
    return response.status(404).json({ error: 'table not found' })
  }

  response.json(table.columns)
}

const createColumn = async (request, response, next) => {
  const user = await User.findByPk(request.decodedToken.id)
  const table = await Table.findByPk(request.body.tableId)

  if (!table) {
    return response.status(404).json({ error: 'table does not exist' })
  }

  const note = await Note.findByPk(table.noteId)

  if (user.id !== note.userId) {
    return response.status(403).end()
  }

  const column = await Column.create(request.body)

  response.status(201).json(column)
}

module.exports = {
  getColumns,
  createColumn
}