const {User} = require('../models/user');
const {UserToken} = require('../models/user-token');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var generateAuthToken = async(user) => {
    var token = jwt.sign({id: user.password}, process.env.JWT_SECRET).toString();
    await addToken(user.id, token);
    return token;
  };

var addToken = async (user_id, token) => {
    try {
        const userToken = UserToken.build({user_id: user_id, token: token});
        await userToken.save();
    } catch (error) {
        console.log(error);
        throw new Error(`Not able to add token with userd id: ${user_id} and token ${token}`);   
    }
}

var removeToken = async (user_id, token) => {
    try {
        const userToken = await findByTokenAndUserId(user_id, token);
        await userToken.destroy();
    } catch (error) {
        throw new Error(`Not able to remove token with userd id: ${user_id} and token ${token}`);        
    }
}

var findByTokenAndUserId = async (user_id, token) => {
    try {
        return await UserToken.findOne({
            where: {
                user_id: user_id,
                token: token
            }
        });
    } catch (error) {
        throw new Error('Invalid token'); 
    }
}

var findByToken = async (token) => {
    try {
        return await UserToken.findOne({
            where: {
                token: token
            }
        });
    } catch (error) {
        throw new Error('Invalid token'); 
    }
}

var findUserById = async (id) => {
    try {
        return await User.findById(id);
    } catch (error) {
        throw new Error('User with id ${id} not found!'); 
    }
}

var findByCredentials = async (username, password) => {
    try {
        const user = await User.findOne({
            where: {
                username: username
            }
        });
        if(user) {
            var result = await bcrypt.compare(password, user.password);
            if(result) {
                return user;
            }
        }
    } catch (error) {
        console.log(error);
        throw new Error('Invalid username or password');   
    }
    throw new Error('Invalid username or password');
}

var getAllUsers = async () => { 
    return await User.findAll();
}

var createUser = async (user) => {
    return await user.save().catch((e) => {
        return new Error('Error while creating the user');
    });
}

module.exports={findByCredentials, getAllUsers, createUser, findByToken, findUserById, generateAuthToken, removeToken};