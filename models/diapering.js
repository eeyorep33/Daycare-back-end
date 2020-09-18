const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Diapering = sequelize.define('diapering', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      type: {
          type: Sequelize.STRING,
          allowNull: false
      },
      time: {
          type: Sequelize.TIME,
          allowNull: false
      }
});

module.exports = Diapering;