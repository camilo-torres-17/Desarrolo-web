const fs = require("fs");

const visitas = {};

function visitasMiddleware(req, res, next) {
  //Ignorar archivos estáticos
  if (
    req.url.includes(".css") ||
    req.url.includes(".js") ||
    req.url.includes(".png") ||
    req.url.includes(".jpg") ||
    req.url.includes(".jpeg") ||
    req.url.includes(".ico")
  ) {
    return next();
  }

  visitas[req.url] = (visitas[req.url] || 0) + 1;

  const fecha = new Date().toLocaleString();
  const ip = req.ip || req.connection.remoteAddress;

  fs.appendFileSync(
    "visitas.txt",
    `${req.url} ha sido visitada ${visitas[req.url]} veces el día ${fecha} desde la IP ${ip}\n`,
  );

  next();
}

module.exports = visitasMiddleware;
