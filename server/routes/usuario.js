const express = require('express');

// Sirve para encriptar
const bcrypt = require('bcrypt');

const _ = require('underscore');

const Usuario = require('../models/usuario');

const app = express();


app.get('/usuario', function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    // Sirve para hacer la busqueda y paginacion o sea
    // mostrar de 5 en 5 (.limit) y el desde es para establecer
    // desde donde quieres mostrar
    Usuario.find({ estado: true }, 'nombre email role estado google img') //mostrar solo los campos requeridos
        .skip(desde)
        .limit(limite)
        .exec( (err, usuarios) =>{
            if( err ){
                return res.status(400).json({
                    ok: false, 
                    err
                });
            };

            // Mustra el total de registros en bd
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true, 
                    usuarios, 
                    cuantos: conteo
                });
            }); 
        })


});
  

// CREA USUARIO
app.post('/usuario', function (req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email, 
        password: bcrypt.hashSync(body.password, 10), 
        role: body.role
    });

    usuario.save( (err, usuarioDB) => {

        if( err ){
            return res.status(400).json({
                ok: false, 
                err
            });
        };

        //Esto es para que en la repsuesta no retorne la contraseña
        // usuarioDB.password = null;

        res.json({
            ok: true, 
            usuario: usuarioDB
        });

    });

  });
  

// ACTUALIZA USUARIO
app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;

    // Manda solo los campos que si se pueden actualizar
    let body = _.pick(req.body, ['nombre','email','img','role','estado'] ) ;

    

    //Sirve para que estos no se manden al objeto y no puedan ser actualizados
    delete body.password;
    delete body.google;

    Usuario.findByIdAndUpdate( id, body, { new : true, runValidators: true}, (err, usuarioDB) =>{

        if( err ) {
            return res.status(400).json({
                ok: false, 
                err
            });
        }
        res.json({
            ok: true, 
            usuario: usuarioDB
        });
    })

    
  })
  
  app.delete('/usuario/:id', function (req, res) {

    let id = req.params.id;
    let cambiaEstado = _.pick(req.body, ['estado'] ) ;

    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuEstModif) => {
        if( err ) {
            return res.status(400).json({
                ok: false, 
                err
            });
        };
        res.json({
            ok: true, 
            usuario: usuEstModif
        });
    });

    // Estas lineas eliminan el usuario pero en uso practico no se elimina, 
    // Solo se cambia el estatus o en este caso estado
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if( err ) {
    //         return res.status(400).json({
    //             ok: false, 
    //             err
    //         });
    //     };

    //     if( !usuarioBorrado ){
    //         return res.status(400).json({
    //             ok: false, 
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         })
    //     }

    //     res.json({
    //         ok: true, 
    //         usuario: usuarioBorrado
    //     })

    // });
      
  })

  module.exports= app;