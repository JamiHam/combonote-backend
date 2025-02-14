const { User, Note } = require('../models')

const getNotes = async (request, response) => {
  const notes = await Note.findAll()
  response.json(notes)
}

const getNotesFromUser = async (request, response) => {
  const user = await User.findByPk(request.decodedToken.id)

  const noteOwner = await User.findOne({
    where: {
      username: request.params.user
    }
  })

  if (!noteOwner) {
    return response.status(404).end()
  }

  if (user.id !== noteOwner.id) {
    return response.status(403).end()
  }

  const notes = await Note.findAll({
    where: {
      userId: noteOwner.id
    }
  })

  response.json(notes)
}

const createNote = async (request, response, next) => {
  const user = await User.findByPk(request.decodedToken.id)
  const note = Note.build(request.body)
  note.userId = user.id

  try {
    await note.save()
  } catch (error) {
    return next(error)
  }
  
  response.status(201).json(note)
}

module.exports = {
  getNotes,
  getNotesFromUser,
  createNote
}