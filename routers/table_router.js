const router = require('express').Router()
const { authorization } = require('../utils/auth')
const tableController = require('../controllers/tables')

router.get('/', tableController.getTables)
router.post('/:noteId', authorization, tableController.createTable)

module.exports = router