const Sequelize = require('Sequelize');

const sequelize = require('../util/database');

const Supplies = sequelize.define('supplies', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      supply_item: {
          type: Sequelize.STRING,
          allowNull: false
      }
});

module.exports = Supplies;