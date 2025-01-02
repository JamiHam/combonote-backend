const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Column extends Model {}

Column.init({
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
  modelName: 'column'
})

module.exports = Column