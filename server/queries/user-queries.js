const {User} = require('../models/user');

var getAllUsers = async () => { 
    return await User.findAll();
}

var createUser = async (user) => {
    return await user.save().catch((e) => {
        return new Error('Error while creating the user');
    });
}

module.exports={getAllUsers, createUser};