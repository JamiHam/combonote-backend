const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Field extends Model {}

Field.init({
  noteId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: { model: 'notes', key: 'id' }
  },
  columnId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: { model: 'columns', key: 'id' }
  },
  value: {
    type: DataTypes.STRING,
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'field'
})

module.exports = Field