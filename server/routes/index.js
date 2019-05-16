const express = require('express');

const app = express();


app.use( require('./usuario') );
app.use( require('./login') );
app.use( require('./categoria'));
app.use( require('./producto'));


//Para subir archivos
app.use( require('./upload') );

//Servir fotos o documentos
app.use( require('./imagenes') );


 module.exports = app;