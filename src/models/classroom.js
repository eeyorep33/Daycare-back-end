const Sequelize = require('Sequelize');

const sequelize = require('../util/database');

const Classroom = sequelize.define('classroom', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
         type: Sequelize.STRING,
         allowNull: false
      }
});

module.exports = Classroom;