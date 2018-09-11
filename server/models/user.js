const Sequelize = require('sequelize');
const {sequelize} = require('../db/db-connection');
const bcrypt = require('bcryptjs');

const User = sequelize.define('users', {
      id: {type: Sequelize.INTEGER, primaryKey:true},
      username: {type: Sequelize.STRING, allowNull: false, unique: true},
      email: Sequelize.STRING,
      password: {type: Sequelize.STRING, allowNull: false},
      phone: Sequelize.STRING,
      address: Sequelize.STRING,
      postalcode: Sequelize.STRING,
      user_role_id: Sequelize.INTEGER,
      createdAt: Sequelize.TIME,
      updatedAt: Sequelize.TIME
    }, {
      freezeTableName: true,
      tableName: 'users'
  });

  User.beforeSave(async (user, options) => {
    await hashPasswordIfChanged(user);
  });

  User.beforeUpdate(async (user, options) => {
    await hashPasswordIfChanged(user);
  });

  var hashPasswordIfChanged = async (user) => {
    if (!user.changed('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(user.password, salt);
    user.password = hashedPass;
  };

  User.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
  
    delete values.password;
    delete values.token;
    return values;
  };

  User.sync();

  module.exports={User};