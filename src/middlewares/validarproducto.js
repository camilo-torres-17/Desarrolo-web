function validarProducto(req, res, next){

    const { nombre, precio, categoria } = req.body;

    if(!nombre || !precio || !categoria){

        return res.status(400).json({
            error: "Todos los campos son obligatorios"
        });

    }

    next();
}

module.exports = validarProducto;