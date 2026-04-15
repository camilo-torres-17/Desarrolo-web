const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// rutas
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(PORT, () =>{
    console.log('ejecutando en el puerto 3000');
});

app.get('/anillos', (req, res) => {
   res.sendFile(__dirname + '/public/views/anillos.html');
});

app.get('/cadenas', (req, res) => {
   res.sendFile(__dirname + '/public/views/cadenas.html');
});

app.get('/dijes', (req, res) => {
   res.sendFile(__dirname + '/public/views/dijes.html');
});

app.get('/aretes', (req, res) => {
   res.sendFile(__dirname + '/public/views/aretes.html');
});

app.get('/pulseras', (req, res) => {
   res.sendFile(__dirname + '/public/views/pulseras.html');
});

app.get('/esmeraldas', (req, res) => {
   res.sendFile(__dirname + '/public/views/esmeraldas.html');
});

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/public/views/.html');
});

app.get('/lineahombre', (req, res) => {
   res.sendFile(__dirname + '/public/views/lineahombre.html');
});

app.get('/lineamujer', (req, res) => {
   res.sendFile(__dirname + '/public/views/lineamujer.html');
});

app.get('/carrito', (req, res) => {
    res.sendFile(__dirname + '/public/views/carrito.html');
});