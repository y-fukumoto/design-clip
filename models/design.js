'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Design = loader.database.define('designs', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false
  },
  tags: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  userid: {
    type: Sequelize.INTEGER
  }
})

module.exports = Design