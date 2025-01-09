const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const noteRouter = require('express').Router()
const { User, Note } = require('../models')

noteRouter.get('/', async (request, response) => {
  const notes = await Note.findAll()
  response.json(notes)
})

noteRouter.post('/', async (request, response, next) => {
  let authorization = request.get('authorization')
  authorization = authorization && authorization.startsWith('Bearer ')
    ? authorization.replace('Bearer ', '')
    : null
  
  let user
  try {
    const decodedToken = jwt.verify(authorization, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'invalid token' })
    }
    user = await User.findByPk(decodedToken.id)
  } catch (error) {
    return next(error)
  }
  
  const note = Note.build(request.body)
  note.userId = user.id
  await note.save()
  
  response.status(201).json(note)
})

module.exports = noteRouter