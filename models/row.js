const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Row extends Model {}

Row.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'row'
})

module.exports = Row