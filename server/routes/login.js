const express = require('express');

// Sirve para encriptar
const bcrypt = require('bcrypt');

// Para crear token
const jwt = require('jsonwebtoken');

//Para autenticacion de google 
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');

const app = express();


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if( err ) {
            return res.status(500).json({
                ok: false, 
                err
            });
        };

        if ( !usuarioDB ) {
            return res.status(500).json({
                ok: false, 
                err: {
                    message: "(Usuario) o contraseña incorrectos"
                }
            });
        }

        // comparar la contraseña que manda el usuario con la contraseña encriptada del servidor
        if( !bcrypt.compareSync(body.password, usuarioDB.password) ){
            return res.status(500).json({
                ok: false, 
                err: {
                    message: "Usuario o (contraseña) incorrectos"
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        },process.env.SEED , { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true, 
            usuario: usuarioDB, 
            token
        })

    })

});



//Configuraciones de google

async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name, 
        email: payload.email, 
        img: payload.picture, 
        google: true
    }

  }
  

//validar el token de google
app.post('/google', async (req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch ( e => {
            return res.status(403).json({
                ok: false, 
                err: e
            })
        })

    // Validamos que no exista un usuario con el mismo correo
    Usuario.findOne({ email: googleUser.email }, ( err, usuarioDB ) => {

        if( err ){
            return res.status(500).json({
                ok: false, 
                err
            })
        }

        if( usuarioDB ){
            
            if( usuarioDB.google === false ){
                return res.status(400).json({
                    ok: false, 
                    err: {
                        message: 'Debe de usar su autenticaciòn' 
                    }
                })
            }else{
                let token = jwt.sign({
                    usuario: usuarioDB
                },process.env.SEED , { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true, 
                    usuario: usuarioDB, 
                    token
                })
            }
        }else{
            //si el usuario no existe en nuestra base de datos
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            //Solo se agrega para cumplir con la validacion de tener una contraseña pero el usuari entrara con las credenciales de google
            usuario.password = ':)'; 

            usuario.save( (err, usuarioDB) => {
                if( err ){
                    return res.status(500).json({
                        ok: false, 
                        err
                    })
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                },process.env.SEED , { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true, 
                    usuario: usuarioDB, 
                    token
                })

            })
        }

    })

    // res.json({
    //     usuario: googleUser
    // });

});

module.exports= app;