const Sequelize = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize(process.env.SCHEMA, process.env.USER_NAME, process.env.PASSWORD, {
    dialect: 'mysql', 
    host: 'localhost'
});


module.exports = sequelize;