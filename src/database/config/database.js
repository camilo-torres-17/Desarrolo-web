const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';

const config = {

    development: {
        username: 'root',
        password: '',
        database: 'algoritmos_preciosos',
        host: '127.0.0.1',
        dialect: 'mysql',
        logging: false
    }

};

const currentConfig = config[env];

const sequelize = new Sequelize(
    currentConfig.database,
    currentConfig.username,
    currentConfig.password,
    {
        host: currentConfig.host,
        dialect: currentConfig.dialect,
        logging: currentConfig.logging
    }
);

module.exports = { sequelize, Sequelize };