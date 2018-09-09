const {findByToken} = require('./../queries/user-queries');

var authenticate = async (req, res, next) => {
    try {
        var token = req.header('x-auth');
        const user = await findByToken(token);
    if(user) {
        req.token = token;
        req.user= user;
        next();
    } else {
        res.status(401).send();   
    }

    } catch (error) {
       res.status(401).send();      
    }
};   

module.exports= {authenticate};