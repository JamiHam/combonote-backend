const router = require('express').Router()
const { authorization } = require('../utils/auth')
const rowController = require('../controllers/rows')

router.get('/:tableId', rowController.getRows)
router.post('/:tableId', authorization, rowController.createRow)
router.put('/:rowId/:columnId', authorization, rowController.updateRow)

module.exports = router