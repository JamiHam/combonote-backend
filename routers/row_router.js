const router = require('express').Router()
const authorization = require('../utils/auth')
const rowController = require('../controllers/rows')

router.get('/api/rows', rowController.getRows)
router.post('/api/rows', authorization, rowController.createRow)
router.put('/api/rows', authorization, rowController.updateRow)

module.exports = router