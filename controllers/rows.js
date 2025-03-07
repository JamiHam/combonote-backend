const { User, Document, Table, Column, Row, Data } = require('../models')

const getRows = async (request, response) => {
  const table = await Table.findByPk(request.params.tableId, {
    include: {
      model: Row,
      include: {
        model: Data
      }
    }
  })

  if (!table) {
    return response.status(404).json({ error: 'table not found' })
  }

  response.json(table.rows)
}

const createRow = async (request, response) => {
  const user = await User.findByPk(request.decodedToken.id)
  const table = await Table.findByPk(request.params.tableId)

  if (!table) {
    return response.status(404).json({ error: 'table not found' })
  }

  const document = await Document.findByPk(table.documentId)

  if (user.id !== document.userId) {
    return response.status(403).end()
  }

  const row = await Row.create(request.params)

  response.status(201).json(row)
}

const updateRow = async (request, response) => {
  const { rowId, columnId } = request.params
  const { value } = request.body

  if (!rowId || !columnId || !value ) {
    return response.status(400).json({ error: 'parameter missing' })
  }

  const user = await User.findByPk(request.decodedToken.id)
  const row = await Row.findByPk(rowId)

  if (!row) {
    return response.status(404).json({ error: 'row not found' })
  }

  const table = await Table.findByPk(row.tableId) 
  const document = await Document.findByPk(table.documentId)

  if (user.id !== document.userId) {
    return response.status(403).end()
  }

  const column = await Column.findByPk(columnId)

  if (!column) {
    return response.status(404).json({ error: 'column not found' })
  }

  let data = await Data.findOne({
    where: {
      rowId,
      columnId
    }
  })

  if (!data) {
    data = await Data.create({ rowId, columnId })
  }

  data.value = value
  await data.save()
  response.json(data)
}

module.exports = {
  getRows,
  createRow,
  updateRow
}