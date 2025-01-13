const jwt = require('jsonwebtoken')
const noteRouter = require('express').Router()
const { User, Note } = require('../models')
const { getTokenFrom, getUserFromToken } = require('../utils/authorization')

noteRouter.get('/', async (request, response) => {
  const notes = await Note.findAll()
  response.json(notes)
})

noteRouter.post('/', async (request, response, next) => {
  let decodedToken = null
  try {
    decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  } catch (error) {
    return next(error)
  }

  // not sure if this is necessary
  /*if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }*/

  const user = await User.findByPk(decodedToken.id)
  const note = Note.build(request.body)
  note.userId = user.id
  await note.save()
  
  response.status(201).json(note)
})

module.exports = noteRouter