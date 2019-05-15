
const express = require('express');

const { verificaToken } = require('../middlewares/autentication');

let app = express();

let Producto = require('../models/producto');

//========================
//Obtener los productos
//========================
app.get('/productos', (req, res) => {
    //Trae los productos
    //populate: usuario categoria
    //paginado

});


//========================
//Obtener un producto por ID
//========================
app.get('/productos/:id', (req, res) => {
    //populate usando categoria y usuario
    //paginado

});

//========================
//Crear un nuevo produccto
//========================
app.post('/productos', (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado

});

//========================
//Actualizar un produccto
//========================
app.put('/productos/:id', (req, res) => {
    

});


//========================
//Borrar un produccto
//========================
app.delete('/productos/:id', (req, res) => {
    //Solo se va a cambiar el estado de disponible

});

module.exports = app;