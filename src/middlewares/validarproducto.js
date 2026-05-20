function validarProducto(req, res, next) {
  const { nombre, precio, categoria, descripcion, stock } = req.body;

  // VALIDAR NOMBRE
  if (!nombre || nombre.trim() === "") {
    return res.status(400).json({
      error: "El nombre es obligatorio",
    });
  }

  // VALIDAR PRECIO
  if (!precio || isNaN(precio) || Number(precio) <= 0) {
    return res.status(400).json({
      error: "Precio inválido",
    });
  }

  if(stock < 0){

    errores.push('El stock no puede ser negativo');

}

  // VALIDAR CATEGORIA
  if (!categoria || categoria.trim() === "") {
    return res.status(400).json({
      error: "La categoría es obligatoria",
    });
  }

  // VALIDAR DESCRIPCION
  if (!descripcion || descripcion.trim().length < 10) {
    return res.status(400).json({
      error: "La descripción debe tener mínimo 10 caracteres",
    });
  }

  next();
}

module.exports = validarProducto;
