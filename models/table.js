const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Table extends Model {}

Table.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'table'
})

module.exports = Table