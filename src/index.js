const express=require('express');

const app=express();

const path = require('path');

app.set('views',path.join(__dirname,'views')); //le decimos a express donde se encuentran las vistas
app.engine('html',require('ejs').renderFile); //Registra un motor de plantillas para archivos html usando ejs
app.set('view engine','ejs');//Configura ejs como el motor de plantilla predeterminado

const bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));

//Archivos staticos
app.use(express.static(path.join(__dirname,'public')));

//Necesitamos encender el servidor
app.listen(3000,()=>{
    console.log("Se conecto al puerto 3000");
})

//Rutas
app.get('/',(req,res)=>{
    res.render("paginaInicio.html");
})

app.get('/login',(req,res)=>{
    res.render("login.html");
})

app.get('/CategoriaColores',(req,res)=>{
    res.render("colores.html");
})

app.get('/LoginCompleto',(req,res)=>{
    res.render("loginCompleto.html");
})


//POST
app.post('/addCategory',(req,res)=>{
    console.log(req.body.colorName, req.body.categoryColor );
    let color = "Azul";
    if(color=== req.body.colorName ){
        console.log("Ingresaste el nombre correcto...");
        res.redirect('/');
    }else{
        console.log("Te equivocaste, intentalo de nuevo...")
        res.redirect('/CategoriaColores');
    }
    
})

//-Login

const user = require('../models/users.js');

app.post('/register',(req,res)=>{

    //Paso 1: obtener los datos del usuario
    let data = new user({
        name: req.body.name ,
        email: req.body.email,
        password: req.body.password
    })

    //Paso 2: vamos a guardar la información
    data.save()
    .then(()=>{
        console.log("Usuario creado")
    })
    .catch((err)=>{
        console.log("ERROR-----",err)
    })
    res.redirect('/LoginCompleto');
})

app.post('/authenticate',(req,res)=>{
    //paso 1 obtener la información 
    let data = {
        email:req.body.email,
        password:req.body.password
    }

    

    const existeUsuario = async()=>{
        //paso 2 verificar si el usuario esta registrado
        const usuario = await user.findOne({email:data.email});
        // usuario = si lo encuentra----- informacion
        // usuario = si no lo encuentra --- null
        
        if(usuario!=null){
            //paso 3 verificar si las contraseñas coinciden
            if(usuario.password == data.password){
                console.log("El usuario entro");
                res.redirect('/');
            }else{
                console.log("La contraseña no coincide");
                res.redirect('/LoginCompleto');
            }
        }else{
            console.log("El usuario no esta registrado");
            res.redirect('/LoginCompleto')
        }
    }

    existeUsuario();

    
})