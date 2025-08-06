const express = require('express');
const session = require('express-session');
require('dotenv').config();

const app = express();

const path = require('path');

const { authMiddleware } = require('./middleware/authMiddleware.js');


app.set('views', path.join(__dirname, 'views')); //le decimos a express donde se encuentran las vistas
app.engine('html', require('ejs').renderFile); //Registra un motor de plantillas para archivos html usando ejs
app.set('view engine', 'ejs');//Configura ejs como el motor de plantilla predeterminado


app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const PORT = process.env.PORT;

app.use(
  session({
    secret: process.env.PRIVATE_KEY_SESSION,
    // resave: false,
    // saveUninitialized: false,
    // cookie: {
    //   secure: process.env.NODE_ENV === "production", // true solo en HTTPS
    //   httpOnly: true,
    //   maxAge: 1000 * 60 * 60 * 24, // 1 día
    //   sameSite: "none", // o "strict" para mayor seguridad
    // },
  })
);

//Archivos staticos
app.use(express.static(path.join(__dirname, 'public')));

//Iniciar Base de datos
require('./db.js');

app.use(authMiddleware({
  // Puedes sobrescribir configs aquí
  debug: true
}));

app.use('/', require('./routes/auth.js'));

//Necesitamos encender el servidor
app.listen(PORT, () => {
  console.log(`[LOG] RUNNING IN PORT ${PORT}`);
})


