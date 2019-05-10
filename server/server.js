require('./config/config');

const mongoose = require('mongoose');
const express = require('express');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


// Configuracion global de rutas
app.use( require('./routes/index.js') );

mongoose.connect(process.env.URLDB, //Se trae del arch config
                {useNewUrlParser: true, useCreateIndex: true}, //Es  una actualizacion de Mongo Atlas
                (err, res) => {

    if( err ) throw err;

    console.log("Base de datos ONLINE");

});

 
app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto: ${process.env.PORT} `);
});