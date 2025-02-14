const router = require('express').Router()
const { authorization } = require('../utils/auth')
const noteController = require('../controllers/notes')

router.get('/', noteController.getNotes)
router.get('/:user', authorization, noteController.getNotesFromUser)
router.post('/', authorization, noteController.createNote)

module.exports = router