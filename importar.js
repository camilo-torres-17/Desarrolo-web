require("dotenv").config();
console.log("HOST:", process.env.MYSQLHOST);
const fs = require('fs');
const mysql = require('mysql2');

// Leer JSON
const productos = JSON.parse(
  fs.readFileSync('./data/productos.json', 'utf8')
);

const connection = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

// Insertar productos
productos.forEach((p) => {
  const sql = `
    INSERT INTO productos (nombre, descripcion, precio, categoria, imagen, stock)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    p.nombre,
    p.descripcion,
    p.precio,
    p.categoria,
    p.imagen,
    p.stock || 0
  ];

  connection.query(sql, values, (err) => {
    if (err) console.log('Error:', err);
  });
});

console.log("Importación completada");