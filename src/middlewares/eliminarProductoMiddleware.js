const fs = require("fs");

function eliminarProductoMiddleware(req, res, next){

    fs.appendFileSync("logeliminar.txt",
        "Se eliminó un producto con ID: " + req.params.id + "\n"
    );

    next();
}

module.exports = eliminarProductoMiddleware;