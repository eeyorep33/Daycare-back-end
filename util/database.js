const Sequelize = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize('mysql://b9789f3888e97b:d2d16f70@us-cdbr-east-02.cleardb.com/heroku_ee08dbd47dd791a?reconnect=true', {
    dialect: 'mysql', 
    host: 'us-cdbr-east-04.cleardb.com'
});


module.exports = sequelize;