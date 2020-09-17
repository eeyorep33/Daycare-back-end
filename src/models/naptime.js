const Sequelize = require('Sequelize');

const sequelize = require('../util/database');

const Naptime = sequelize.define('naptime', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      start_time: {
          type: Sequelize.TIME,
          allowNull: false
      },
      end_time: {
        type: Sequelize.TIME,
        allowNull: false
      }
});

module.exports = Naptime;