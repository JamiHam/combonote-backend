const User = require('./user')
const Table = require('./table')
const Column = require('./column')

User.hasMany(Table)
Table.belongsTo(User)

Table.hasMany(Column)
Column.belongsTo(Table)

User.sync({ alter: true })
Table.sync({ alter: true })
Column.sync({ alter: true })

module.exports = {
  User,
  Table,
  Column
}