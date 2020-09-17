const Sequelize = require('Sequelize');

const sequelize = require('../util/database');

const Report = sequelize.define('report', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      }
});

module.exports = Report;