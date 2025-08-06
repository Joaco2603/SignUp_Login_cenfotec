const express = require('express');
const session = require('express-session');
require('dotenv').config();

const app = express();

const path = require('path');

const { authMiddleware } = require('./middleware/authMiddleware.js');

app.set('views', path.join(__dirname, 'views')); // We tell Express where to find the views.
app.engine('html', require('ejs').renderFile); // Registers a template engine for HTML files using EJS.
app.set('view engine', 'ejs'); // Sets EJS as the default template engine.


app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const PORT = process.env.PORT;

app.use(
  session({
    secret: process.env.PRIVATE_KEY_SESSION,
    resave: false,
    saveUninitialized: false,
  })
);

//Static files
app.use(express.static(path.join(__dirname, 'public')));

//Iniatilize db
require('./db.js');

app.use(authMiddleware({
  debug: true
}));

app.use('/', require('./routes/auth.js'));

//Listen port
app.listen(PORT, () => {
  console.log(`[LOG] RUNNING IN PORT ${PORT}`);
})


