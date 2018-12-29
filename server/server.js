require('./config/config');

const _ = require('lodash');
const express = require('express');
var bodyParser = require('body-parser');

const {getAvailableOrders, getReservedOrders, getStartedOrders, getDoneOrdersFromToday, reserveOrder, startOrder, markOrderDone, markOrderRemoved, getAllOrdersByTimestamps} = require('./queries/order-queries');
const {findByCredentials, getAllUsers, createUser, generateAuthToken, removeToken, deleteUserById, updateUserById, updatePasswordChanged} = require('./queries/user-queries');
const {User} = require('./models/user');
const {getAllUserRoles, getById} = require('./queries/user-role-queries');
const {authenticate, isUserDriver} = require('./middleware/authenticate');
var cors = require('cors');

var app = express();
app.use(bodyParser.json());


app.use(cors());

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth");
   res.header("Access-Control-Expose-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth");
   next();
});

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
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        address: req.body.address,
        postalcode: req.body.postalcode,
        city: req.body.city,
        user_role_id: roleId,
        needPasswordChange: true
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
        const token = await generateAuthToken(user);
        const userRole = await getById(user.user_role_id);
        const isAdmin = userRole.role_name === 'Admin';
        const isController = userRole.role_name === 'Ajojärjestelijä';
        const userBody = _.pick(user, ['id','username', 'first_name', 'last_name', 'email', 'phone', 'address','postalcode', 'city', 'needPasswordChange', 'user_role_id']);
        res.header('x-auth', token).send({...userBody, isAdmin, isController});
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

 app.get('/users/with-roles', authenticate, async (req, res) => {
    const users = await getAllUsers();
    const userRoles = await getAllUserRoles();
    const usersWithRoles = users.map((user) => {
        const userBody = _.pick(user, ['id','username', 'first_name', 'last_name', 'email', 'phone', 'address','postalcode', 'city', 'user_role_id']);
        const role = userRoles.find(role => role.id === userBody.user_role_id);
        return {
            ...userBody,
            role
        };
    });
    return res.send(usersWithRoles);
});

app.delete('/users/:id', authenticate, async (req, res) => {
    try {
        res.send(await deleteUserById(req.params.id));
    } catch(e) {
        console.log(e);
        res.status(400).send();
    }
}); 

app.patch('/users/:id', authenticate, async (req, res) => {
    try {
        res.send(await updateUserById(req.params.id, req.body));
    } catch(e) {
        console.log(e);
        res.status(400).send();
    }
}); 

app.patch('/users/:id/password-changed', authenticate, async (req, res) => {
    try {
        res.send(await updatePasswordChanged(req.params.id, req.body.newPassword));
    } catch(e) {
        console.log(e);
        res.status(400).send();
    }
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
    const orders = await getReservedOrders(req.isDriver, req.user.id);
    const ordersWithDriverDetails = await addDriverDetails(orders);
    res.send(ordersWithDriverDetails);
}); 

app.get('/started-orders', authenticate, isUserDriver, async (req, res) => {
    const orders = await getStartedOrders(req.isDriver, req.user.id);
    const ordersWithDriverDetails = await addDriverDetails(orders);
    res.send(ordersWithDriverDetails);
}); 

async function addDriverDetails(orders) {
    const response = new Array();
    for (const order of orders) {
        const user = await User.findById(order.kuljettaja_id);
        const driverDetails = _.pick(user, ['first_name', 'last_name']);
        response.push({...order.dataValues, driverDetails});
    }
    return response;
  }

app.get('/todays-done-orders', authenticate, isUserDriver, async (req, res) => {
    const orders = await getDoneOrdersFromToday(req.isDriver, req.user.id);
    const ordersWithDriverDetails = await addDriverDetails(orders);
    res.send(ordersWithDriverDetails);
}); 

app.get('/all-orders/from/:from/to/:to', authenticate, async (req, res) => {
    res.send(await getAllOrdersByTimestamps(req.params.from, req.params.to));
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

app.patch('/orders/remove/:id', authenticate, async (req, res) => {
    try {
        res.send(await markOrderRemoved(req.params.id));
    } catch(e) {
        console.log(e);
        res.status(400).send();
    }
}); 
   
module.exports={app};