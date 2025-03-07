const { User, Document, Table, Column } = require('../models')

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
  const { tableId } = request.params
  const { name } = request.body

  const user = await User.findByPk(request.decodedToken.id)
  const table = await Table.findByPk(tableId)

  if (!table) {
    return response.status(404).json({ error: 'table does not exist' })
  }

  const document = await Document.findByPk(table.documentId)

  if (user.id !== document.userId) {
    return response.status(403).end()
  }

  const column = await Column.create({ name, tableId })

  response.status(201).json(column)
}

module.exports = {
  getColumns,
  createColumn
}