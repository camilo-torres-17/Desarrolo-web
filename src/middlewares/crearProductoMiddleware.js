const fs = require("fs");

function crearProductoMiddleware(req, res, next) {
  fs.appendFileSync("logcrear.txt", "Se creó un producto: " + req.url + "\n");

  next();
}

module.exports = crearProductoMiddleware;
