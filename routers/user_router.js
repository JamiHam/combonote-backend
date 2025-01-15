const router = require('express').Router()
const userController = require('../controllers/users')

router.get('/', userController.getUsers)
router.get('/:id', userController.getUser)
router.post('/', userController.createUser)

module.exports = router