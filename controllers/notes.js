const { User, Note } = require('../models')

const getNotes = async (request, response) => {
  const notes = await Note.findAll()
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
  createNote
}