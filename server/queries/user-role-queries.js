const {UserRole} = require('../models/user-role');

var getAllUserRoles = async () => { 
    return await UserRole.findAll();
}

var getById = async (id) => { 
    return await UserRole.findById(id);
}

module.exports={getAllUserRoles, getById};