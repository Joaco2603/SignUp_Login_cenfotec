const { Router } = require('express');
const bcrypt = require('bcrypt');
const router = Router();

// Modelo del usuario
const User = require('../models/users.js');

//Htmls
router.get('/',(req,res)=>{
  res.render("index.html");
})

router.get('/dashboard', (req, res) => {
  res.render("dashboard.html");
})

router.get('/login', (req, res) => {
  res.render("login.html");
})

router.get('/signup', (req, res) => {
  res.render("signup.html");
})

//Use cases
// Middleware de validación
const validateAuthData = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }
  next();
};

// Login
router.post("/login", validateAuthData, async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFind = await User.findOne({ email });

    if (!userFind || !(await bcrypt.compare(password, userFind.password))) {
      return res.status(401).render('login.html', { 
        error: 'Credenciales inválidas' 
      });
    }

    req.session.user = {
      id: userFind._id,
      email: userFind.email.toLowerCase(),
      name: userFind.name.toLowerCase()
    };

    req.session.save(err => {
      if (err) {
        console.error('Error saving session:', err);
        return res.status(500).render('login.html', {
          error: 'Error interno del servidor'
        });
      }
      res.redirect('/dashboard');
    });

  } catch (error) {
    console.error(error);
    res.status(500).render('login.html', {
      error: 'Error interno del servidor'
    });
  }
});

router.post("/signup", async (req, res) => {
  const { name, last_name, email, password, password_check } = req.body;

  try {
    // Verificar que las contraseñas coincidan
    if (password !== password_check) {
      return res.status(400).render('signup.html', {
        error: 'Las contraseñas no coinciden',
        values: req.body
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render('signup.html', {
        error: 'Correo electrónico ya esta registrado',
        values: req.body
      });
    }

    // Password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      name: name.toLowerCase(),
      last_name: last_name.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      created_at: new Date()
    });

    // Create session
    req.session.user = {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name
    };

    // Guardar sesión
    req.session.save(err => {
      if (err) {
        console.error('Error al guardar sesión:', err);
        return res.status(500).render('signup.html', {
          error: 'Error interno al crear la sesión',
          values: req.body
        });
      }
      
      // Redirigir al dashboard o página de bienvenida
      res.redirect('/dashboard');
    });

  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).render('signup.html', {
      error: 'Error interno del servidor',
      values: req.body
    });
  }
});


// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Error al cerrar sesión');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

module.exports = router;
