'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const User = loader.database.define('users', {
  userid: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id: {
    type: Sequelize.TEXT,
    primaryKey: true,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false
});

module.exports = User;