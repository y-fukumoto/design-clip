'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const DesignTag = loader.database.define('designtags', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  designId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  tagId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

module.exports = DesignTag