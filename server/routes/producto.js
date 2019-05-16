
const express = require('express');

const { verificaToken } = require('../middlewares/autentication');

let app = express();

let Producto = require('../models/producto');

//========================
//Obtener los productos
//========================
app.get('/productos', verificaToken, (req, res) => {
    //Trae los productos
    //populate: usuario categoria
    //paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);

    Producto.find({})
        .skip(desde)
        .limit(limite)
        .populate('usuario')
        .populate('categoria')
        .exec( (err, producto) => {

            if( err ){
                return res.json({
                    ok: false, 
                    err
                });
            };

            // Mustra el total de registros en bd
            Producto.count({ }, (err, conteo) => {
                res.json({
                    ok: true, 
                    producto, 
                    cuantos: conteo
                });
            }); 

        })

});


//========================
//Obtener un producto por ID
//========================
app.get('/productos/:id', verificaToken, (req, res) => {
    //populate usando categoria y usuario

    let id = req.params.id

    Producto.findById( id )
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec( (err, productoDB ) => {
            if( err ){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if( !productoDB ){
                return res.status(400).json({
                    ok: false,
                    message: 'El producto no existe'
                })
            }

            res.status(200).json({
                ok:true,
                producto: productoDB
            })
        })

});


//========================
//Buscar producto
//========================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino; 

    let regex = new RegExp(termino, 'i'); //La i es para que se insencible aminusculas y mayu

    Producto.find({ nombre: regex})
        .populate('categoria', 'nombre')
        .exec( (err, productos) => {
            if( err ){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok:true, 
                productos
            })
        })
});
//========================
//Crear un nuevo produccto
//========================
app.post('/productos', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado

    let body = req.body;

    producto = new Producto({
        nombre : body.nombre, 
        precioUni : body.precioUni,
        descripcion : body.descripcion,
        disponible : body.disponible, 
        categoria : body.categoria, 
        usuario : req.usuario._id
    });

    producto.save( (err, productoSave ) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if( !productoSave ){
            return res.status(400).json({
                ok:false, 
                err
            })
        }

        res.status(200).json({
            ok: true, 
            producto: productoSave
        })

    })

});

//========================
//Actualizar un produccto
//========================
app.put('/productos/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;
    let body = req.body;

    Producto.findOneAndUpdate(id, body, ( err, prodUpd) => {

        if( err ){
            return res.status(500).json({
                ok: false,
                err
            })
        };

        res.json({
            ok: true, 
            message: 'Produto actualizado'
        })

    })

});


//========================
//Borrar un produccto
//========================
app.delete('/productos/:id', (req, res) => {
    //Solo se va a cambiar el estado de disponible

    let id = req.params.id;

    Producto.findById( id, ( err, productoDB ) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            })
        };

        if( !productoDB ){
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        };

        productoDB.disponible = false;

        productoDB.save( ( err, productoBorrado ) => {

            if( err ){
                return res.status(500).json({
                    ok: false,
                    err
                })
            };

            res.json({
                ok:true, 
                producto: productoBorrado,
                message: 'Producto borrado'
            })

        })
    })


});

module.exports = app;