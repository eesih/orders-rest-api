const Sequelize = require('sequelize');
const {sequelize} = require('../db/db-connection');

const UserToken = sequelize.define('user_tokens', {
    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    token: {type :Sequelize.STRING, allowNull: false},
    user_id: {type: Sequelize.INTEGER, allowNull: false}
  }, {
    freezeTableName: true,
    tableName: 'user_tokens', 
  });
  
  UserToken.sync();

  module.exports={UserToken};