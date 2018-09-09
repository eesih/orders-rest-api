const Sequelize = require('sequelize');
const {sequelize} = require('../db/db-connection');

const Order = sequelize.define('tilaukset', {
    id: {type: Sequelize.INTEGER, primaryKey:true},
    time: Sequelize.BIGINT,
    tilaaja: Sequelize.STRING,
    sposti: Sequelize.STRING,
    puh: Sequelize.STRING,
    lahettaja: Sequelize.STRING,
    puh2: Sequelize.STRING,
    nouto: Sequelize.STRING,
    vastaanottaja: Sequelize.STRING,
    puh3: Sequelize.STRING,
    vienti: Sequelize.STRING,
    lisatieto: Sequelize.STRING,
    lisatieto2: Sequelize.STRING,
    yhthenk: Sequelize.STRING,
    varattu: Sequelize.BOOLEAN,
    aloitettu: Sequelize.BOOLEAN,
    ajettu: Sequelize.BOOLEAN,
    muokattu: Sequelize.TIME,
    kuljettaja_id: Sequelize.INTEGER,
    ajettu_pvm: Sequelize.DATEONLY
  }, {
    freezeTableName: true,
    tableName: 'tilaukset',
    timestamps: false,
  });

  Order.sync();

  module.exports={Order};