

const express = require('express');

let { verificaToken, verificaRole } = require('../middlewares/autentication');

let app = express();

let Categoria = require('../models/categoria');

//==================================
//Mostrar todas las categorias
//==================================
app.get( '/categoria', verificaToken ,(req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec( (err, categorias) => {

            if( err ){
                return res.status(500).json({
                    ok: false, 
                    err
                });
            };

            res.json({
                ok: true, 
                categorias
            })
        }
        
    )


});

//==================================
//Mostrar una categoria por id
//==================================
app.get( '/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    console.log(id);

    Categoria.findById( id, (err, categoriaDB) => {

        if ( err ){
            return res.status(500).json({
                ok: false, 
                err
            });
        };

        if ( !categoriaDB ){
            return res.status(500).json({
                ok: false, 
                err: {
                    message: "El ID no es correcto"
                }
            });
        };

        res.json({
            ok: true, 
            categoria: categoriaDB
        })

    })

    //Categoria.indById(....);
});

//==================================
//Crear Nueva categoria
//==================================
app.post( '/categoria', verificaToken ,(req, res) => {
    //Categoria.indById(....);
    // req.usuario._id 

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion, 
        usuario: req.usuario._id
    });

    categoria.save( ( err, categoriaDB ) => {
        if( err ){
            return res.status(500).json({
                ok: false, 
                err
            });
        };

        if( !categoriaDB ){
            return res.status(400).json({
                ok: false, 
                err
            });
        }

        res.json({
            ok: true, 
            categoria: categoriaDB
        });
    })


});


//==================================
//Actualizar la categoria
//==================================
app.put( '/categoria/:id', (req, res) => {

    let id = req.params.id;

    let body = req.body;

    Categoria.findByIdAndUpdate(id, body, (err, categoriaDB) => {

        if ( err ){
            res.json({
                ok: false, 
                err
            });
        };

        res.json({
            ok: true, 
            message: "Categoria Actualizada"
        })

    })

});


//==================================
//Eliminar categoria
//==================================
app.delete( '/categoria/:id', [  verificaToken, verificaRole ], (req, res) => {
    //Solo un admin puede borrar categorias

    let id = req.params.id


        Categoria.findByIdAndRemove( id, (err, categoriaBorrada) => {

            console.log("ENTRA A BORRASR");
            
            if ( err ){
                return res.status(400).json({
                    ok: false, 
                    err
                })
            };

            if( !categoriaBorrada ){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Usuario no encontrado"
                    }                    
                })
            };

            res.json({
                ok: true, 
                categoria: categoriaBorrada
            });

        })
    

});


module.exports = app;