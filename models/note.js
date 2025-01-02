const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Note extends Model {}

Note.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  tableId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'tables', key: 'id' }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'note'
})

module.exports = Note