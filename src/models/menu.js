const Sequelize = require('Sequelize');

const sequelize = require('../util/database');

const Menu = sequelize.define('menu', {
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
      url: {
        type: Sequelize.STRING,
        allowNull: true 
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      parent_menu_item: {
        type: Sequelize.STRING,
        allowNull: true 
      }
})

module.exports = Menu;