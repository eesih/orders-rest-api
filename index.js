require('./server/config/config');

const _ = require('lodash');
const express = require('express');
var bodyParser = require('body-parser');

const {getAvailableOrders, getReservedOrders, getDoneOrdersFromToday, reserveOrder, startOrder, markOrderDone} = require('./server/queries/order-queries');
const {findByCredentials, getAllUsers, createUser, generateAuthToken, removeToken} = require('./server/queries/user-queries');
const {User} = require('./server/models/user');
const {getAllUserRoles, getById} = require('./server/queries/user-role-queries');
const {authenticate, isUserDriver} = require('./server/middleware/authenticate');

var app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})

app.post('/users', authenticate, async (req, res) => {
    const roleId = req.body.user_role_id;
    const role = await getById(roleId);
    if(!role) {
        return res.status(401).send();
    }

    const newUser = User.build({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        address: req.body.address,
        postalcode: req.body.postalcode,
        user_role_id: roleId
    });
    try {
        const createdUser =  await createUser(newUser);
        res.send(createdUser);
    } catch(e) {
        res.status(400).send();
    }
});

app.post('/users/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['username', 'password']);
        const user = await findByCredentials(body.username, body.password);
        console.log('JOJO',user);
        const token = await generateAuthToken(user);
        res.header('x-auth', token).send(user);
    } catch(e) {
        console.log(e);
        res.status(401).send();
    }
});

app.delete('/users/me/token', authenticate, async (req, res) => {
    try {
         await removeToken(req.user.id, req.token);
         res.status(200).send();
     } catch(e) {
         res.status(400).send();
     }
    
 });

app.get('/users', authenticate, async (req, res) => {
    const users = await getAllUsers();
    return res.send(users);
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.get('/user-roles', authenticate, async (req, res) => {
    const roles = await getAllUserRoles();
    return res.send(roles);
});

app.get('/available-orders', authenticate, async (req, res) => {
    res.send(await getAvailableOrders());
}); 

app.get('/reserved-orders', authenticate, isUserDriver, async (req, res) => {
    res.send(await getReservedOrders(req.isDriver, req.user.id));
}); 

app.get('/todays-done-orders', authenticate, isUserDriver, async (req, res) => {
    res.send(await getDoneOrdersFromToday(req.isDriver, req.user.id));
}); 

app.patch('/orders/reserve/:id', authenticate, async (req, res) => {
    try {
        res.send(await reserveOrder(req.params.id, req.user.id));
    } catch(e) {
        console.log(e);
        res.status(400).send();
    }
});  

app.patch('/orders/start/:id', authenticate, async (req, res) => {
    try {
        res.send(await startOrder(req.params.id, req.user.id));
    } catch(e) {
        console.log(e);
        res.status(400).send();
    }
}); 

app.patch('/orders/done/:id', authenticate, async (req, res) => {
    try {
        res.send(await markOrderDone(req.params.id, req.user.id));
    } catch(e) {
        console.log(e);
        res.status(400).send();
    }
}); 
   
module.exports={app};