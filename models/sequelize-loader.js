'use strict';
const Sequelize = require('sequelize');
const config = require('../config')
const sequelize = new Sequelize(
  process.env.DATABASE_URL || config.DB,
  { logging: true }
);

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};