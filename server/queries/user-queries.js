const {User} = require('../models/user');
const bcrypt = require('bcryptjs');


var findByToken = async (token) => {
    try {
        return await User.findOne({
            where: {
                token: token
            }
        });
    } catch (error) {
        throw new Error('Invalid token'); 
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

module.exports={findByCredentials, getAllUsers, createUser, findByToken};