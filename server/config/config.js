

// =========================
// Puerto
// ==========================

process.env.PORT = process.env.PORT || 3000;


// =========================
// Entorno
// ==========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =========================
// Vencimiento del token
// ==========================
//60 segundos
// 60 minutos
// 24 horas
// 30 dias
// process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.CADUCIDAD_TOKEN = '48h';


// =========================
// SEED de utenticacion (semilla de autenticacion)
// ==========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


// =========================
// Base de Datos
// ==========================
let urlDB;

if( process.env.NODE_ENV === 'dev' ){
    urlDB = 'mongodb://localhost:27017/cafe';
             
}else{
    urlDB = process.env.MONGO_URI; //Esta es la variable que envia heroku (se tiene que declarar en heroku)
}

process.env.URLDB = urlDB;


// =========================
// Google client-Id
// ==========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '459420246935-mh3uknmdplnpe9brnqjoilu8qnu6n9kt.apps.googleusercontent.com';