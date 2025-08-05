const { Router } = require('express');

const router = Router();

// Modelo del usuario
const user = require('../models/users.js');

//Htmls
router.get('/', (req, res) => {
  res.render("index.html");
})

router.get('/login', (req, res) => {
  res.render("login.html");
})

router.get('/signup', (req, res) => {
  res.render("signup.html");
})

//Use cases
router.post("/login", async (req, res) => {
  if (!req.body) return res.status(404).send('Body is required')

  const { email, password } = req.body;

  try {

    const userFind = await user.findOne({
      email: email,
      password: password
    });

    if (!userFind) {
      return res.status(404).send('User not found');
    }

    // Almacenar datos en la sesión
    req.session.check = true;
    req.session.email = email;

    res.json(userFind);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

// Signup
router.post("/signup", async (req, res) => {
  if (!req.body) return res.status(404).send('Body is required')

  const { name, last_name, email, password } = req.body;
  try {
    const newUser = await user.save({
      name: name,
      last_name: last_name,
      email: email,
      password: password
    });

    // Almacenar datos en la sesión
    req.session.check = true;
    req.session.email = email;

    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

// Forgot password
router.post("/forgot_password", (req, res) => {
  // Almacenar datos en la sesión
  req.session.check = true;
  req.session.email = req.body.email; // Asumo que email viene en el body

  res.send('Procesando recuperación de contraseña');
});

router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.send('Sesión cerrada correctamente');
  });
});

module.exports = router;
