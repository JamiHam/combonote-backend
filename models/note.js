const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Note extends Model {}

Note.init({
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
  modelName: 'note'
})

module.exports = Note