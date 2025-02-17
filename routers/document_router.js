const router = require('express').Router()
const { authorization } = require('../utils/auth')
const documentController = require('../controllers/documents')

router.get('/', documentController.getDocuments)
router.get('/:user', authorization, documentController.getDocumentsFromUser)
router.post('/', authorization, documentController.createDocument)

module.exports = router