const Sequelize = require('Sequelize');

const sequelize = require('../util/database');

const Facility = sequelize.define('facility', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      }
}

)

module.exports = Facility;