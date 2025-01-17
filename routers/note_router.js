const router = require('express').Router()
const { authorization } = require('../utils/auth')
const noteController = require('../controllers/notes')

router.get('/', noteController.getNotes)
router.post('/', authorization, noteController.createNote)

module.exports = router