const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const ruta = path.join(__dirname, 'data', 'productos.json');
app.use(express.json());

const PORT = process.env.PORT || 3000;

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

// servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// LOGIN ADMIN
app.post('/api/productos', upload.single('imagen'), (req, res) => {

    const ruta = path.join(__dirname, 'data', 'productos.json');
    let productos = JSON.parse(fs.readFileSync(ruta));

  const imagenRuta = req.file 
    ? "/images/uploads/" + req.file.filename 
    : "/images/default.png";

    const nuevo = {
        id: Date.now(),
        nombre: req.body.nombre,
        precio: req.body.precio,
        categoria: req.body.categoria,
        descripcion: req.body.descripcion,
        imagen: "/images/uploads/" + req.file.filename
    };

    productos.push(nuevo);

    fs.writeFileSync(ruta, JSON.stringify(productos, null, 2));

    res.json(nuevo);
});

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

// OBTENER PRODUCTOS
app.get('/api/productos', (req, res) => {
    const data = fs.readFileSync('./data/productos.json');
    res.json(JSON.parse(data));
});

// CREAR PRODUCTO
app.post('/api/productos', (req, res) => {
    let productos = JSON.parse(fs.readFileSync('./data/productos.json'));

    const nuevo = {
        id: Date.now(),
        ...req.body
    };

    productos.push(nuevo);

    fs.writeFileSync('./data/productos.json', JSON.stringify(productos, null, 2));

    res.json(nuevo);
});

// ELIMINAR
app.delete('/api/productos/:id', (req, res) => {
    let productos = JSON.parse(fs.readFileSync('./data/productos.json'));

    productos = productos.filter(p => p.id != req.params.id);

    fs.writeFileSync('./data/productos.json', JSON.stringify(productos, null, 2));

    res.json({mensaje: "Eliminado"});
});

// EDITAR
app.put('/api/productos/:id', (req, res) => {
    let productos = JSON.parse(fs.readFileSync('./data/productos.json'));

    productos = productos.map(p => 
        p.id == req.params.id ? {...p, ...req.body} : p
    );

    fs.writeFileSync('./data/productos.json', JSON.stringify(productos, null, 2));

    res.json({mensaje: "Actualizado"});
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/views/login.html');
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/public/views/admin.html');
});