const User = require('./user')
const Table = require('./table')
const Column = require('./column')
const Note = require('./note')
const Field = require('./field')

User.hasMany(Table)
Table.belongsTo(User)

Table.hasMany(Column)
Column.belongsTo(Table)

Table.hasMany(Note)
Note.belongsTo(Table)

Note.belongsToMany(Column, { through: Field })
Column.belongsToMany(Note, { through: Field })

User.sync({ alter: true })
Table.sync({ alter: true })
Column.sync({ alter: true })
Note.sync({ alter: true })
Field.sync({ alter: true })

module.exports = {
  User,
  Table,
  Column,
  Note,
  Field
}