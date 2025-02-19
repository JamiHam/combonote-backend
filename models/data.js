const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Data extends Model {}

Data.init({
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
  modelName: 'data'
})

module.exports = Data