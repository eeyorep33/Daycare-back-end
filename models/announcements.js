const Sequelize = require('Sequelize');

const sequelize = require('../util/database');

const Announcements =  sequelize.define('announcement', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      content: {
         type: Sequelize.STRING,
         allowNull: false
      }
     
 })
 module.exports = Announcements;