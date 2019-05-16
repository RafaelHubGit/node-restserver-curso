const jwt = require('jsonwebtoken');

// ================================
// Verificar Token
// ================================
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify( token, process.env.SEED , (err, decoded) => {

        if( err ){
            return res.status(401).json({
                ok: false, 
                err: {
                    message: 'Token no válido'
                }
            })
        }

        //se esta extrayendo la informacion del token
        req.usuario = decoded.usuario;
        
        next(); //Para continuar con la funcion
    });

    // Si se ejecuta este codigo no trae nada mas que el token
    // res.json({
    //     token: token
    // });


};


// ================================
// Verificar ROLE
// ================================
let verificaRole = (req, res, next) => {

    let usuario = req.usuario;
    let role = usuario.role;

    if ( role === "ADMIN_ROLE"){
        next()
    }else{
        return res.json({
            ok: false, 
            err: {
                message: "El usuario no es Administrador"
            }
        })
    }

}

// ================================
// Verificar token para imagen
// ================================
let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify( token, process.env.SEED , (err, decoded) => {

        if( err ){
            return res.status(401).json({
                ok: false, 
                err: {
                    message: 'Token no válido'
                }
            })
        }

        //se esta extrayendo la informacion del token
        req.usuario = decoded.usuario;
        
        next(); //Para continuar con la funcion
    });

}



module.exports = {
    verificaToken, 
    verificaRole,
    verificaTokenImg
}