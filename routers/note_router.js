const noteRouter = require('express').Router()
const { authorization } = require('../utils/auth')
const { User, Note } = require('../models')

noteRouter.get('/', async (request, response) => {
  const notes = await Note.findAll()
  response.json(notes)
})

noteRouter.post('/', authorization, async (request, response, next) => {
  const user = await User.findByPk(request.decodedToken.id)
  const note = Note.build(request.body)
  note.userId = user.id

  try {
    await note.save()
  } catch (error) {
    return next(error)
  }
  
  response.status(201).json(note)
})

module.exports = noteRouter