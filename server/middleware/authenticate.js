const {findByToken, findUserById} = require('./../queries/user-queries');
const {getById} = require('./../queries/user-role-queries');

var authenticate = async (req, res, next) => {
    try {
        var token = req.header('x-auth');
        const userToken = await findByToken(token);
        const user_id = userToken.user_id;
        const user = await findUserById(user_id);
    if(user) {
        req.token = token;
        req.user = user;
        next();
    } else {
        res.status(401).send();   
    }

    } catch (error) {
       res.status(401).send();      
    }
};   

var isUserDriver = async (req, res, next) => {
    try {
        var token = req.header('x-auth');
        const user = await findByToken(token);
        if(user) {
            const user_role_id = user.user_role_id;
            const userRole = await getById(user_role_id);
            if(userRole.dataValues.role_name === 'kuljettaja') {
                console.log('User is a driver');
                req.isDriver = true;
            } else {
                console.log('User is not a driver');
                req.isDriver = false;
            }
        } 
        next();
    } catch (error) {
       res.status(401).send();      
    }
};

module.exports= {authenticate, isUserDriver};