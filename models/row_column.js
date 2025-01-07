const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class RowColumn extends Model {}

RowColumn.init({
  rowId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: { model: 'rows', key: 'id' }
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
  modelName: 'row_column'
})

module.exports = RowColumn