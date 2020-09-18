const Sequelize = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize('mysql://b282e0fd009417:f1515863@us-cdbr-east-02.cleardb.com/heroku_a7b708b98d88c66?reconnect=true', {
    dialect: 'mysql', 
    host: 'us-cdbr-east-02.cleardb.com'
});


module.exports = sequelize;