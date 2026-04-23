const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = 3000;

// 📁 Ruta JSON
const ruta = path.join(__dirname, 'data', 'productos.json');

// 📦 Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🖼️ MULTER (subida de imágenes)
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'public/images/uploads');
    },

    filename: function (req, file, cb) {

        const nombre = file.originalname;

        const rutaArchivo = path.join(
            __dirname,
            'public/images/uploads',
            nombre
        );

        // 🔍 Si ya existe, no duplicar
        if (fs.existsSync(rutaArchivo)) {
            req.fileExist = true;
            return cb(null, nombre);
        }

        req.fileExist = false;
        cb(null, nombre);
    }
});

const upload = multer({ storage: storage });

// =========================
// 📦 API PRODUCTOS
// =========================

// 🔹 GET (OBTENER)
app.get('/api/productos', (req, res) => {
    const data = fs.readFileSync(ruta);
    res.json(JSON.parse(data));
});

// 🔹 POST (CREAR CON IMAGEN)
app.post('/api/productos', upload.single('imagen'), (req, res) => {

    let productos = JSON.parse(fs.readFileSync(ruta));

    let imagenRuta;

    if (req.fileExist) {
        // 👉 ya existía la imagen
        imagenRuta = "/images/uploads/" + req.file.originalname;
    } else {
        // 👉 nueva imagen
        imagenRuta = "/images/uploads/" + req.file.filename;
    }

    const nuevo = {
        id: Date.now(),
        nombre: req.body.nombre,
        precio: req.body.precio,
        categoria: req.body.categoria,
        descripcion: req.body.descripcion,
        imagen: imagenRuta
    };

    productos.push(nuevo);

    fs.writeFileSync(ruta, JSON.stringify(productos, null, 2));

    res.json(nuevo);
});

// 🔹 DELETE
app.delete('/api/productos/:id', (req, res) => {
    let productos = JSON.parse(fs.readFileSync(ruta));

    productos = productos.filter(p => p.id != req.params.id);

    fs.writeFileSync(ruta, JSON.stringify(productos, null, 2));

    res.json({ mensaje: "Eliminado" });
});

// 🔹 PUT (EDITAR)
app.put('/api/productos/:id', (req, res) => {
    let productos = JSON.parse(fs.readFileSync(ruta));

    productos = productos.map(p =>
        p.id == req.params.id ? { ...p, ...req.body } : p
    );

    fs.writeFileSync(ruta, JSON.stringify(productos, null, 2));

    res.json({ mensaje: "Actualizado" });
});

// =========================
// 🌐 VISTAS
// =========================

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/views/index.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/views/login.html');
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/public/views/admin.html');
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

app.get('/carrito', (req, res) => {
    res.sendFile(__dirname + '/public/views/carrito.html');
});

// 🚀 INICIAR
app.listen(PORT, () => {
    console.log("Servidor en http://localhost:3000");
});