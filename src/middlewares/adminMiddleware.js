function adminMiddleware(req, res, next){

    if(req.session && req.session.authenticated){
        return next();
    }

    res.redirect('/login');

    fs.appendFileSync("logadmin.txt",
            "El administrador ingresó al admin: " + req.url + "\n"
        );
    
        next();
}

module.exports = adminMiddleware;