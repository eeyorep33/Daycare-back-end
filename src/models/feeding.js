const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Feeding = sequelize.define('feeding', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      time: {
          type: Sequelize.TIME,
          allowNull: false
      },
      food: {
          type: Sequelize.STRING,
          allowNull: false
      },
      amount: {
        type: Sequelize.STRING,
        allowNull: false
      }
});

module.exports = Feeding;