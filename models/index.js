const User = require('./user')
const Table = require('./table')

User.hasMany(Table)
Table.belongsTo(User)

User.sync({ alter: true })
Table.sync({ alter: true })

module.exports = {
  User,
  Table
}