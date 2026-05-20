function validarLogin(req, res, next) {
  const { usuario, password } = req.body;

  // VALIDAR USUARIO
  if (!usuario || usuario.trim() === "") {
    return res.status(400).json({
      error: "El usuario es obligatorio",
    });
  }

  // VALIDAR PASSWORD
  if (!password || password.trim() === "") {
    return res.status(400).json({
      error: "La contraseña es obligatoria",
    });
  }

  // LONGITUD MINIMA
  if (password.length < 4) {
    return res.status(400).json({
      error: "La contraseña debe tener mínimo 4 caracteres",
    });
  }

  next();
}

module.exports = validarLogin;
