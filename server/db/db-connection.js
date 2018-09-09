const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_USER_PASS, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
  port:  process.env.MYSQL_PORT,
  operatorsAliases: false
});

module.exports={sequelize};