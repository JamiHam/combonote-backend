const User = require('./user')
const Note = require('./note')
const Table = require('./table')
const Column = require('./column')
const Row = require('./row')
const RowColumn = require('./row_column')

User.hasMany(Note)
Note.belongsTo(User)

Note.hasMany(Table)
Table.belongsTo(Note)

Table.hasMany(Column)
Column.belongsTo(Table)

Table.hasMany(Row)
Row.belongsTo(Table)

Row.hasMany(RowColumn)
RowColumn.belongsTo(Row)

Column.hasMany(RowColumn)
RowColumn.belongsTo(Column)

/*Row.belongsToMany(Column, { through: RowColumn })
Column.belongsToMany(Row, { through: RowColumn })*/

module.exports = {
  User,
  Note,
  Table,
  Column,
  Row,
  RowColumn
}