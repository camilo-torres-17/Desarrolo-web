const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Producto = sequelize.define('Producto', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },

    precio: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    categoria: {
        type: DataTypes.STRING,
        allowNull: false
    },

    descripcion: {
        type: DataTypes.TEXT
    },

    imagen: {
        type: DataTypes.STRING
    }

}, {
    tableName: 'productos',
    timestamps: false
});

module.exports = Producto;