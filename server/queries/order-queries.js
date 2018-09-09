const Sequelize = require('sequelize');
const {Order} = require('../models/order');

var getDoneOrdersFromToday = async (isDriver, id) => {
    await Order.sync();
    let orders;
    const today = new Date();
    if(isDriver) {
        orders = await Order.findAll({ where: 
            { 
                ajettu: true,
                kuljettaja_id: id,
                ajettu_pvm: today
            } 
        });
    } else {
        orders = await Order.findAll({ where: { ajettu: true, ajettu_pvm: today} });
    }    
    console.log(`Reserved order count: ${orders.length}`);
    return orders;
}    

var getReservedOrders = async (isDriver, id) => {
    await Order.sync();
    let orders;
    if(isDriver) {
        orders = await Order.findAll({ where: 
            { 
                varattu: true,
                ajettu: false,
                aloitettu: false,
                kuljettaja_id: id
            } 
        });
    } else {
        orders = await Order.findAll({ where: { 
            varattu: true,
            ajettu: false,
            aloitettu: false,
        } 
    });
    }    
    console.log(`Reserved order count: ${orders.length}`);
    return orders;
}

var getAvailableOrders = async () => {
    await Order.sync();
    const orders = await Order.findAll({ where: { varattu: false} });
    console.log(`Available order count: ${orders.length}`);
    return orders;
}

var reserveOrder = async (id, driver_id) => {
    await Order.sync();
    const orderToBeReserved = await Order.findById(id);
    if(orderToBeReserved.varattu || orderToBeReserved.aloitettu || orderToBeReserved.ajettu) {
        throw new Error(`Cant reserve ${id} order`);
    }
    orderToBeReserved.varattu = true;
    orderToBeReserved.kuljettaja_id = driver_id;
    return await orderToBeReserved.save();
}

var startOrder = async (id, driver_id) => {
    await Order.sync();
    const orderToBeStarted = await Order.findById(id);
    if(!orderToBeStarted.varattu || orderToBeStarted.aloitettu || orderToBeStarted.ajettu || orderToBeStarted.kuljettaja_id !== driver_id) {
        throw new Error(`Cant start ${id} order`);
    }
    orderToBeStarted.aloitettu = true;
    return await orderToBeStarted.save();
}

var markOrderDone = async (id, driver_id) => {
    await Order.sync();
    const orderToBeMarkedAsDone = await Order.findById(id);
    if(!orderToBeMarkedAsDone.varattu || !orderToBeMarkedAsDone.aloitettu || orderToBeMarkedAsDone.ajettu || orderToBeMarkedAsDone.kuljettaja_id !== driver_id) {
        throw new Error(`Cant mark ${id} order as done`);
    }
    orderToBeMarkedAsDone.ajettu = true;
    orderToBeMarkedAsDone.ajettu_pvm = new Date();
    return await orderToBeMarkedAsDone.save();
}


module.exports={getAvailableOrders, getReservedOrders, getDoneOrdersFromToday, reserveOrder, startOrder, markOrderDone};

