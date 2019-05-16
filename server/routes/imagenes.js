
const express = require('express');

const fs = require('fs');
const path = require('path');

const { verificaTokenImg } = require('../middlewares/autentication');

let app = express();

//Se utiliza el verificaToken para que los documentos esten protegidos y no puedan accesar a ellos 
// con la url de la imagen
app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {


    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if( fs.existsSync( pathImage ) ){
        res.sendFile( pathImage );
    }else{
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }

    
})



module.exports = app;