const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const Playtime = sequelize.define('playtime', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      activity: {
          type: Sequelize.STRING,
          allowNull: false
      }

});

module.exports = Playtime;