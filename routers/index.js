const router = require('express').Router()

const userRouter = require('./user_router')
const loginRouter = require('./login_router')
const documentRouter = require('./document_router')
const tableRouter = require('./table_router')
const columnRouter = require('./column_router')
const rowRouter = require('./row_router')

router.use('/api/users', userRouter)
router.use('/api/login', loginRouter)
router.use('/api/documents', documentRouter)
router.use('/api/tables', tableRouter)
router.use('/api/columns', columnRouter)
router.use('/api/rows', rowRouter)

module.exports = router