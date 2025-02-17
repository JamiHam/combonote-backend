const { User, Document } = require('../models')

const getDocuments = async (request, response) => {
  const documents = await Document.findAll()
  response.json(documents)
}

const getDocumentsFromUser = async (request, response) => {
  const user = await User.findByPk(request.decodedToken.id)

  const documentOwner = await User.findOne({
    where: {
      username: request.params.user
    }
  })

  if (!documentOwner) {
    return response.status(404).end()
  }

  if (user.id !== documentOwner.id) {
    return response.status(403).end()
  }

  const documents = await Document.findAll({
    where: {
      userId: documentOwner.id
    }
  })

  response.json(documents)
}

const createDocument = async (request, response, next) => {
  const user = await User.findByPk(request.decodedToken.id)
  const document = Document.build(request.body)
  document.userId = user.id

  try {
    await document.save()
  } catch (error) {
    return next(error)
  }
  
  response.status(201).json(document)
}

module.exports = {
  getDocuments,
  getDocumentsFromUser,
  createDocument
}