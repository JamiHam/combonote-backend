const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Document extends Model {}

Document.init({
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
  modelName: 'document'
})

module.exports = Document