const Sequelize = require('Sequelize');

const sequelize = require('../util/database');

const Comments = sequelize.define('comments', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      comment: {
          type: Sequelize.STRING,
          allowNull: false
      }
});

module.exports = Comments;