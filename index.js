require('./server/config/config');

const _ = require('lodash');
const express = require('express');
var bodyParser = require('body-parser');

const {getOrders, updateOrder} = require('./server/queries/order-queries');
const {findByCredentials, getAllUsers, createUser} = require('./server/queries/user-queries');
const {User} = require('./server/models/user');
const {getAllUserRoles, getById} = require('./server/queries/user-role-queries');
const {authenticate} = require('./server/middleware/authenticate');

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
        const token = await user.generateAuthToken(user);
        res.header('x-auth', token).send(user);
    } catch(e) {
        console.log(e);
        res.status(401).send();
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

app.get('/orders', authenticate, async (req, res) => {
    const reserved = req.query.reserved ? req.query.reserved : true;
    const started = req.query.started ? req.query.started : true;
    const done = req.query.done ? req.query.done : true;

    console.log(`Reserver ${reserved} and started ${started} and done ${done}`)

    const orders = await getOrders(reserved, started, done);
    res.send(orders);
});  

app.patch('/orders/:id', authenticate, async (req, res) => {
    try {
        var id = req.params.id;
        const reserved = req.body.reserved ? req.body.reserved : false;
        const started = req.body.started ? req.body.started : false;
        const done = req.body.done ? req.body.done : false;
        const driver_id = 3; //TODO
        const orders = await updateOrder(id, reserved, started, done, driver_id);
        res.send(orders);
    } catch(e) {
        console.log(e);
        res.status(400).send();
    }
});    

module.exports={app};