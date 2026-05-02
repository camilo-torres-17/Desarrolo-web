const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const session = require('express-session');

const app = express();
const PORT = 3000;

// 📁 Ruta JSON
const ruta = path.join(__dirname, 'data', 'productos.json');

// 📦 Middleware
app.use(express.json());
app.use(session({
    secret: 'algoritmos-preciosos-secreto',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
        secure: false, // Para desarrollo local
        sameSite: false // Para desarrollo local
    }
}));
app.use(express.static(path.join(__dirname, 'public')));

const auth = (req, res, next) => {
    if (req.session && req.session.authenticated) {
        return next();
    }
    res.status(401).json({ error: 'No autorizado' });
};

app.post('/api/login', (req, res) => {
    const { usuario, password } = req.body;

    if (usuario === 'admin' && password === '1234') {
        req.session.authenticated = true;
        return res.json({ success: true });
    }

    res.json({ success: false });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Error al cerrar sesión' });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true });
    });
});

app.post('/api/subscribe', (req, res) => {
    const { email } = req.body;
    const correo = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!correo || !/^\S+@\S+\.\S+$/.test(correo)) {
        return res.status(400).json({ success: false, error: 'Correo inválido' });
    }

    const suscriptoresPath = path.join(__dirname, 'data', 'suscriptores.json');
    let suscriptores = [];
    if (fs.existsSync(suscriptoresPath)) {
        suscriptores = JSON.parse(fs.readFileSync(suscriptoresPath));
    }

    if (suscriptores.includes(correo)) {
        return res.json({ success: true, message: 'Ya estás suscrito' });
    }

    suscriptores.push(correo);
    fs.writeFileSync(suscriptoresPath, JSON.stringify(suscriptores, null, 2));

    res.json({ success: true, message: 'Gracias por suscribirte' });
});

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
app.post('/api/productos', auth, upload.single('imagen'), (req, res) => {

    let productos = JSON.parse(fs.readFileSync(ruta));

    let imagenRuta = "/images/default.png"; // Imagen por defecto

    if (req.file) {
        if (req.fileExist) {
            // 👉 ya existía la imagen
            imagenRuta = "/images/uploads/" + req.file.originalname;
        } else {
            // 👉 nueva imagen
            imagenRuta = "/images/uploads/" + req.file.filename;
        }
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
app.delete('/api/productos/:id', auth, (req, res) => {
    let productos = JSON.parse(fs.readFileSync(ruta));

    productos = productos.filter(p => p.id != req.params.id);

    fs.writeFileSync(ruta, JSON.stringify(productos, null, 2));

    res.json({ mensaje: "Eliminado" });
});

// 🔹 PUT (EDITAR)
app.put('/api/productos/:id', auth, upload.single('imagen'), (req, res) => {

    let productos = JSON.parse(fs.readFileSync('./data/productos.json'));

    productos = productos.map(p => {

        if(p.id == req.params.id){

            return {
                ...p,
                nombre: req.body.nombre,
                precio: req.body.precio,
                categoria: req.body.categoria,
                descripcion: req.body.descripcion,

                // 🔥 SOLO CAMBIA IMAGEN SI SUBEN UNA NUEVA
                imagen: req.file 
                    ? "/images/uploads/" + req.file.filename 
                    : p.imagen
            };
        }

        return p;
    });

    fs.writeFileSync('./data/productos.json', JSON.stringify(productos, null, 2));

    res.json({mensaje: "Actualizado"});
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
    if (req.session && req.session.authenticated) {
        return res.sendFile(__dirname + '/public/views/admin.html');
    }
    res.redirect('/login');
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

app.get('/lineahombre', (req, res) => {
    res.sendFile(__dirname + '/public/views/lineahombre.html');
});

app.get('/lineamujer', (req, res) => {
    res.sendFile(__dirname + '/public/views/lineamujer.html');
});

// 🚀 INICIAR
app.listen(PORT, () => {
    console.log("Servidor en http://localhost:3000");
});