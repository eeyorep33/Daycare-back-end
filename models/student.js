const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Student = sequelize.define('student', {
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
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true
      }, 
      is_active: {
         type: Sequelize.BOOLEAN,
         allowNull: false,
         defaultValue: true
      }, 
      checked_in: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true 
      }      
})

module.exports = Student;