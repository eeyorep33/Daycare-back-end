const Sequelize = require('sequelize');

const sequelize = new Sequelize('daycare-schema', 'root', 'fergip33', {
    dialect: 'mysql', 
    host: 'localhost'
});


module.exports = sequelize;