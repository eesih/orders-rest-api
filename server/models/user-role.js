const Sequelize = require('sequelize');
const {sequelize} = require('../db/db-connection');

const UserRole = sequelize.define('user_roles', {
    id: {type: Sequelize.INTEGER, primaryKey: true},
    role_name: {type :Sequelize.STRING, allowNull: false}
  }, {
    freezeTableName: true,
    tableName: 'user_roles', 
    timestamps: false
  });
  UserRole.sync();
  module.exports={UserRole};