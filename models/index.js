const User = require('./user')
const Document = require('./document')
const Table = require('./table')
const Column = require('./column')
const Row = require('./row')
const RowColumn = require('./row_column')

User.hasMany(Document)
Document.belongsTo(User)

Document.hasMany(Table)
Table.belongsTo(Document)

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
  Document,
  Table,
  Column,
  Row,
  RowColumn
}