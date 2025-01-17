const router = require('express').Router()
const { authorization } = require('../utils/auth')
const columnController = require('../controllers/columns')

router.get('/:tableId', columnController.getColumns)
router.post('/:tableId', authorization, columnController.createColumn)

module.exports = router