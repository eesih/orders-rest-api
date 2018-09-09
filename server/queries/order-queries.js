const Sequelize = require('sequelize');
const {Order} = require('../models/order');


var getOrders = async (reserved, started, done) => { 
    await Order.sync();
    const orders = await Order.findAll({ where: { 
        varattu: reserved,
        aloitettu: started,
        ajettu: done
     } });
    console.log(`Tilaukset ${orders.length}`);
    return orders;
}

var updateOrder = async (id, reserved, started, done, driver_id) => {
    await Order.sync();
    const updatedOrder = await Order.update({
        varattu: reserved,
        aloitettu: started,
        ajettu: done,
        kuljettaja_id: driver_id
    }, {
        where: {id: id}
    }).catch((e) => {
        console.log(`Exception while updating the ${id} order`);
        return null;
    });
    return updatedOrder;
}

module.exports={getOrders, updateOrder};

