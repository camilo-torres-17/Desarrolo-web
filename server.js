const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// 📁 RUTA JSON
const ruta = path.join(__dirname, 'data', 'productos.json');

// 📦 MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 📸 CONFIGURAR MULTER (SUBIR IMÁGENES)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// =========================
// 🔹 VISTAS
// =========================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/anillos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/anillos.html'));
});

app.get('/cadenas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/cadenas.html'));
});

app.get('/dijes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/dijes.html'));
});

app.get('/aretes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/aretes.html'));
});

app.get('/pulseras', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/pulseras.html'));
});

app.get('/esmeraldas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/esmeraldas.html'));
});

app.get('/lineahombre', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/lineahombre.html'));
});

app.get('/lineamujer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/lineamujer.html'));
});

app.get('/carrito', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/carrito.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/login.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/admin.html'));
});

// =========================
// 🔹 API PRODUCTOS (CRUD)
// =========================

// 📥 OBTENER PRODUCTOS
app.get('/api/productos', (req, res) => {
    try {
        const data = fs.readFileSync(ruta);
        res.json(JSON.parse(data));
    } catch (error) {
        res.json([]);
    }
});

// ➕ CREAR PRODUCTO (CON IMAGEN)
app.post('/api/productos', upload.single('imagen'), (req, res) => {
    try {
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
            imagen: imagenRuta
        };

        productos.push(nuevo);

        fs.writeFileSync(ruta, JSON.stringify(productos, null, 2));

        res.json(nuevo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al guardar producto" });
    }
});

// ❌ ELIMINAR
app.delete('/api/productos/:id', (req, res) => {
    let productos = JSON.parse(fs.readFileSync(ruta));

    productos = productos.filter(p => p.id != req.params.id);

    fs.writeFileSync(ruta, JSON.stringify(productos, null, 2));

    res.json({ mensaje: "Eliminado" });
});

// ✏️ EDITAR
app.put('/api/productos/:id', (req, res) => {
    let productos = JSON.parse(fs.readFileSync(ruta));

    productos = productos.map(p =>
        p.id == req.params.id ? { ...p, ...req.body } : p
    );

    fs.writeFileSync(ruta, JSON.stringify(productos, null, 2));

    res.json({ mensaje: "Actualizado" });
});

// =========================
// 🚀 SERVIDOR
// =========================

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});