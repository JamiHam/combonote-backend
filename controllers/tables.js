const { User, Document, Table } = require('../models')

const getTables = async (request, response) => {
  const tables = await Table.findAll()
  response.json(tables)
}

const createTable = async (request, response, next) => {
  const { name } = request.body
  const { documentId } = request.params

  const user = await User.findByPk(request.decodedToken.id)
  const document = await Document.findByPk(documentId)

  if (!document) {
    return response.status(404).json({ error: 'document does not exist' })
  }

  if (user.id !== document.userId) {
    return response.status(403).end()
  }

  const table = await Table.create({ name, documentId })

  response.status(201).json(table)
}

module.exports = {
  getTables,
  createTable
}