const Sequelize = require('sequelize');
const {sequelize} = require('../db/db-connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    updatedAt: Sequelize.TIME, 
    token: Sequelize.STRING
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

  User.prototype.generateAuthToken = async(user) => {
    var token = jwt.sign({id: user.password}, process.env.JWT_SECRET).toString();

    user.token = token;
    console.log('generateAuthToken',user);
    await user.save();
    return token;
  };

  User.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
  
    delete values.password;
    delete values.token;
    return values;
  };

  User.sync();

  module.exports={User};