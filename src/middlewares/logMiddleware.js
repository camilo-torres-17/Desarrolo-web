const fs = require("fs");

function logMiddleware(req, res, next) {

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

    fs.appendFileSync("log.txt",
        "El usuario ingresó a la página: " + req.url + "\n"
    );

    next();
}

module.exports = logMiddleware;