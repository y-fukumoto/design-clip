'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Tag = loader.database.define('tags', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  body: {
    type: Sequelize.TEXT,
    primaryKey: true,
    allowNull: false
  }
})

module.exports = Tag