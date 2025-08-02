const express = require('express');
const cookieParser = require('cookie-parser');

const app=express();

const path = require('path');

app.set('views',path.join(__dirname,'views')); //le decimos a express donde se encuentran las vistas
app.engine('html',require('ejs').renderFile); //Registra un motor de plantillas para archivos html usando ejs
app.set('view engine','ejs');//Configura ejs como el motor de plantilla predeterminado

const bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));

app.use(cookieParser());
app.use(
  session({
    secret: process.env.PRIVATE_KEY_SESSION,
    resave: false,
    saveUninitialized: false,
  })
);

//Archivos staticos
app.use(express.static(path.join(__dirname,'public')));

//Necesitamos encender el servidor
app.listen(process.env.PORT,()=>{
    console.log("Se conecto al puerto 3000");
})

//Rutas
app.get('/',(req,res)=>{
    res.render("paginaInicio.html");
})

app.get('/LoginCompleto',(req,res)=>{
    res.render("loginCompleto.html");
})


//-Login

const user = require('./models/users.js');

