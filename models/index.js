const User = require('./user')
const Table = require('./table')
const Column = require('./column')
const Row = require('./row')
const RowColumn = require('./row_column')

User.hasMany(Table)
Table.belongsTo(User)

Table.hasMany(Column)
Column.belongsTo(Table)

Table.hasMany(Row)
Row.belongsTo(Table)

Row.belongsToMany(Column, { through: RowColumn })
Column.belongsToMany(Row, { through: RowColumn })

User.sync({ alter: true })
Table.sync({ alter: true })
Column.sync({ alter: true })
Row.sync({ alter: true })
RowColumn.sync({ alter: true })

module.exports = {
  User,
  Table,
  Column,
  Row,
  RowColumn
}