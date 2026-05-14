function tiempoMiddleware(req, res, next) {
  const inicio = Date.now();

  res.on("finish", () => {
    const tiempo = Date.now() - inicio;

    console.log(req.method, req.url, tiempo + "ms");
  });

  next();
}

module.exports = tiempoMiddleware;
