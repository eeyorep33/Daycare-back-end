const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Medicine = sequelize.define('medicine', {
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
      dosage: {
        type: Sequelize.STRING,
         allowNull: false  
      },
      time: {
         type: Sequelize.TIME,
         allowNull: false 
      }
})

module.exports = Medicine;