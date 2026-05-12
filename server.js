const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const session = require('express-session');
const morgan = require('morgan');
const { sequelize } = require('./src/database/config/database');
const Producto = require('./src/database/models/Producto');

const logMiddleware = require('./src/middlewares/logMiddleware');
const visitasMiddleware = require('./src/middlewares/visitasMiddleware');
const validarProducto = require('./src/middlewares/validarProducto');
const adminMiddleware = require('./src/middlewares/adminMiddleware');
const tiempoMiddleware = require('./src/middlewares/tiempoMiddleware');
const crearProductoMiddleware = require('./src/middlewares/crearProductoMiddleware');
const eliminarProductoMiddleware = require('./src/middlewares/eliminarProductoMiddleware');


const app = express();
app.use(logMiddleware);
app.use(visitasMiddleware);
app.use(tiempoMiddleware);

const PORT = 3000;

// 📁 Ruta JSON
const ruta = path.join(__dirname, 'data', 'productos.json');

// 📦 Middleware
app.use(express.json());
app.use(morgan('dev'));

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
app.get('/api/productos', async (req, res) => {

    try {
        const productos = await Producto.findAll();
        res.json(productos);
    } catch(error){
        res.status(500).json({
            error: "Error obteniendo productos"
        });
    }

});

// 🔹 POST (CREAR CON IMAGEN)
app.post('/api/productos', auth, upload.single('imagen'), async (req, res) => {

    try {

        let imagenRuta = "/images/default.png";

        if(req.file){

            imagenRuta = "/images/uploads/" + req.file.filename;

        }

        const nuevoProducto = await Producto.create({

            nombre: req.body.nombre,
            precio: req.body.precio,
            categoria: req.body.categoria,
            descripcion: req.body.descripcion,
            imagen: imagenRuta

        });

        res.json(nuevoProducto);

    } catch(error){

        console.log(error);

        res.status(500).json({
            error: "Error creando producto"
        });

    }

});

// 🔹 DELETE
app.delete('/api/productos/:id', auth, async (req, res) => {

    try {

        await Producto.destroy({

            where: {
                id: req.params.id
            }

        });

        res.json({
            mensaje: "Producto eliminado"
        });

    } catch(error){

        console.log(error);

        res.status(500).json({
            error: "Error eliminando producto"
        });

    }

});

// 🔹 PUT (EDITAR)
app.put('/api/productos/:id', auth, upload.single('imagen'), async (req, res) => {

    try {

        const producto = await Producto.findByPk(req.params.id);

        if(!producto){

            return res.status(404).json({
                error: "Producto no encontrado"
            });

        }

        let imagenRuta = producto.imagen;

        if(req.file){

            imagenRuta = "/images/uploads/" + req.file.filename;

        }

        await producto.update({

            nombre: req.body.nombre,
            precio: req.body.precio,
            categoria: req.body.categoria,
            descripcion: req.body.descripcion,
            imagen: imagenRuta

        });

        res.json({
            mensaje: "Producto actualizado"
        });

    } catch(error){

        console.log(error);

        res.status(500).json({
            error: "Error actualizando producto"
        });

    }

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

app.get('/admin', adminMiddleware, (req, res) => {
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

app.get('/lineahombre', (req, res) => {
    res.sendFile(__dirname + '/public/views/lineahombre.html');
});

app.get('/lineamujer', (req, res) => {
    res.sendFile(__dirname + '/public/views/lineamujer.html');
});

sequelize.authenticate()
    .then(() => {
        console.log('Base de datos conectada');
    })
    .catch(err => {
        console.log(err);
    });

sequelize.sync()
    .then(() => {
        console.log("Tablas sincronizadas");
    });

// 🚀 INICIAR
app.listen(PORT, () => {
    console.log("Servidor en http://localhost:3000");
});