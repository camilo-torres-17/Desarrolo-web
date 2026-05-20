require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const session = require("express-session");
const morgan = require("morgan");
const { sequelize } = require("./src/database/config/database");
const Producto = require("./src/database/models/Producto");
const Usuario = require("./src/database/models/Usuario");

const logMiddleware = require("./src/middlewares/logMiddleware");
const visitasMiddleware = require("./src/middlewares/visitasMiddleware");
const validarProducto = require("./src/middlewares/validarProducto");
const validarLogin = require("./src/middlewares/validarLogin");
const adminMiddleware = require("./src/middlewares/adminMiddleware");
const tiempoMiddleware = require("./src/middlewares/tiempoMiddleware");
const crearProductoMiddleware = require("./src/middlewares/crearProductoMiddleware");
const eliminarProductoMiddleware = require("./src/middlewares/eliminarProductoMiddleware");

const app = express();
app.use(logMiddleware);
app.use(visitasMiddleware);
app.use(tiempoMiddleware);

const PORT = 3000;

// Ruta JSON
const ruta = path.join(__dirname, "data", "productos.json");

// Middleware
app.use(express.json());
app.use(morgan("dev"));

app.use(
  session({
    secret: "algoritmos-preciosos-secreto",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      secure: false, // Para desarrollo local
      sameSite: false, // Para desarrollo local
    },
  }),
);
app.use(express.static(path.join(__dirname, "public")));

const auth = (req, res, next) => {
  if (req.session && req.session.authenticated) {
    return next();
  }
  res.status(401).json({ error: "No autorizado" });
};

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Todos los campos son obligatorios",
      });
    }

    const usuario = await Usuario.findOne({
      where: {
        email: email,
      },
    });

    if (!usuario) {
      return res.status(400).json({
        success: false,
        error: "Correo no registrado",
      });
    }

    if (usuario.password !== password) {
      return res.status(400).json({
        success: false,
        error: "Contraseña incorrecta",
      });
    }

    req.session.authenticated = true;

    req.session.usuario = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    };

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: "Error iniciando sesión",
    });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, error: "Error al cerrar sesión" });
    }
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
});

app.post("/api/subscribe", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || nombre.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: "Nombre inválido",
      });
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Correo inválido",
      });
    }

    if (!password || password.length < 4) {
      return res.status(400).json({
        success: false,
        error: "La contraseña debe tener mínimo 4 caracteres",
      });
    }

    const usuarioExistente = await Usuario.findOne({
      where: {
        email: email,
      },
    });

    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        error: "El correo ya está registrado",
      });
    }

    await Usuario.create({
      nombre,
      email,
      password,
    });

    res.json({
      success: true,
      message: "Cuenta creada correctamente",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: "Error creando usuario",
    });
  }
});
app.post("/api/register", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // VALIDAR NOMBRE
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({
        error: "El nombre es obligatorio",
      });
    }

    // VALIDAR EMAIL
    if (!email || email.trim() === "") {
      return res.status(400).json({
        error: "El correo es obligatorio",
      });
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(email)) {
      return res.status(400).json({
        error: "Correo inválido",
      });
    }

    // VALIDAR PASSWORD
    if (!password || password.length < 4) {
      return res.status(400).json({
        error: "La contraseña debe tener mínimo 4 caracteres",
      });
    }

    // VERIFICAR SI EXISTE
    const existe = await Usuario.findOne({
      where: {
        email,
      },
    });

    if (existe) {
      return res.status(400).json({
        error: "Ese correo ya está registrado",
      });
    }

    // CREAR USUARIO
    await Usuario.create({
      nombre,
      email,
      password,
    });

    res.json({
      mensaje: "Usuario creado",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Error registrando usuario",
    });
  }
});

// MULTER (subida de imágenes)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/uploads");
  },

  filename: function (req, file, cb) {
    const nombre = file.originalname;

    const rutaArchivo = path.join(__dirname, "public/images/uploads", nombre);

    // Si ya existe, no duplicar
    if (fs.existsSync(rutaArchivo)) {
      req.fileExist = true;
      return cb(null, nombre);
    }

    req.fileExist = false;
    cb(null, nombre);
  },
});

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },

  fileFilter: (req, file, cb) => {
    const formatosPermitidos = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (formatosPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes PNG, JPG, JPEG o WEBP"));
    }
  },
});

// =========================
//  API PRODUCTOS
// =========================

// GET (OBTENER)
app.get("/api/productos", async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    res.status(500).json({
      error: "Error obteniendo productos",
    });
  }
});

//  POST (CREAR CON IMAGEN)
app.post(
  "/api/productos",
  auth,
  (req, res, next) => {
    upload.single("imagen")(req, res, function (err) {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      next();
    });
  },
  validarProducto,
  async (req, res) => {
    try {
      let imagenRuta = "/images/default.png";

      if (req.file) {
        imagenRuta = "/images/uploads/" + req.file.filename;
      }

      const productoExistente = await Producto.findOne({
        where: {
          nombre: req.body.nombre,
        },
      });

      if (productoExistente) {
        return res.status(400).json({
          error: "Ese producto ya existe",
        });
      }

      const nuevoProducto = await Producto.create({
        nombre: req.body.nombre,
        precio: req.body.precio,
        stock: req.body.stock,
        categoria: req.body.categoria,
        descripcion: req.body.descripcion,
        imagen: imagenRuta,
      });

      res.json(nuevoProducto);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        error: "Error creando producto",
      });
    }
  },
);

// DELETE
app.delete("/api/productos/:id", auth, async (req, res) => {
  try {
    await Producto.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      mensaje: "Producto eliminado",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Error eliminando producto",
    });
  }
});

// PUT (EDITAR)
app.put(
  "/api/productos/:id",
  auth,
  upload.single("imagen"),
  validarProducto,
  async (req, res) => {
    try {
      const producto = await Producto.findByPk(req.params.id);

      if (!producto) {
        return res.status(404).json({
          error: "Producto no encontrado",
        });
      }

      let imagenRuta = producto.imagen;

      if (req.file) {
        imagenRuta = "/images/uploads/" + req.file.filename;
      }

      await producto.update({
        nombre: req.body.nombre,
        precio: req.body.precio,
        categoria: req.body.categoria,
        descripcion: req.body.descripcion,
        imagen: imagenRuta,
      });

      res.json({
        mensaje: "Producto actualizado",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        error: "Error actualizando producto",
      });
    }
  },
);

// =========================
// 🌐 VISTAS
// =========================

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/views/index.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/views/login.html");
});

app.get("/admin", adminMiddleware, (req, res) => {
  res.sendFile(__dirname + "/public/views/admin.html");
});

app.get("/anillos", (req, res) => {
  res.sendFile(__dirname + "/public/views/anillos.html");
});

app.get("/cadenas", (req, res) => {
  res.sendFile(__dirname + "/public/views/cadenas.html");
});

app.get("/dijes", (req, res) => {
  res.sendFile(__dirname + "/public/views/dijes.html");
});

app.get("/aretes", (req, res) => {
  res.sendFile(__dirname + "/public/views/aretes.html");
});

app.get("/pulseras", (req, res) => {
  res.sendFile(__dirname + "/public/views/pulseras.html");
});

app.get("/esmeraldas", (req, res) => {
  res.sendFile(__dirname + "/public/views/esmeraldas.html");
});

app.get("/carrito", (req, res) => {
  res.sendFile(__dirname + "/public/views/carrito.html");
});

app.get("/lineahombre", (req, res) => {
  res.sendFile(__dirname + "/public/views/lineahombre.html");
});

app.get("/lineamujer", (req, res) => {
  res.sendFile(__dirname + "/public/views/lineamujer.html");
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Base de datos conectada");

    return sequelize.sync({ force: false });
  })
  .then(() => {
    console.log("Tablas sincronizadas");

    app.get("/usuarios", async (req, res) => {
      const usuarios = await Usuario.findAll();

      res.json(usuarios);
    });

    app.listen(PORT, () => {
      console.log("Servidor en http://localhost:3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
