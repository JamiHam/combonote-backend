const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')

const { User } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = await User.create({ username, passwordHash })
    res.json(user)
  } catch (error) {
    res.status(400).json({ error })
  }
})

module.exports = router