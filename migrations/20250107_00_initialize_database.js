const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false
      }
    })

    await queryInterface.createTable('documents', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    })

    await queryInterface.addColumn('documents', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    })

    await queryInterface.createTable('tables', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    })

    await queryInterface.addColumn('tables', 'document_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'documents', key: 'id' }
    })

    await queryInterface.createTable('columns', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    })

    await queryInterface.addColumn('columns', 'table_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'tables', key: 'id' }
    })

    await queryInterface.createTable('rows', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    })

    await queryInterface.addColumn('rows', 'table_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'tables', key: 'id' }
    })

    await queryInterface.createTable('row_columns', {
      row_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: 'rows', key: 'id' }
      },
      column_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: 'columns', key: 'id' }
      },
      value: {
        type: DataTypes.STRING,
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('row_columns')
    await queryInterface.dropTable('rows')
    await queryInterface.dropTable('columns')
    await queryInterface.dropTable('tables')
    await queryInterface.dropTable('documents')
    await queryInterface.dropTable('users')
  }
}