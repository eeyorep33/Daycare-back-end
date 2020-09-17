const Sequelize = require('Sequelize');

const sequelize = require('../util/database');


const Employee = sequelize.define('employee', {
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
      userName: {
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
      is_admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false      
      },
      checked_in: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false 
      }  ,
      password: {
        type: Sequelize.STRING,
        allowNull: true
      }     

})

module.exports = Employee;