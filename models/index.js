const User = require('./user')
const Document = require('./document')
const Table = require('./table')
const Column = require('./column')
const Row = require('./row')
const Data = require('./data')

User.hasMany(Document)
Document.belongsTo(User)

Document.hasMany(Table)
Table.belongsTo(Document)

Table.hasMany(Column)
Column.belongsTo(Table)

Table.hasMany(Row)
Row.belongsTo(Table)

Row.hasMany(Data)
Data.belongsTo(Row)

Column.hasMany(Data)
Data.belongsTo(Column)

/*Row.belongsToMany(Column, { through: Data })
Column.belongsToMany(Row, { through: Data })*/

module.exports = {
  User,
  Document,
  Table,
  Column,
  Row,
  Data
}