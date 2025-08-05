const mongoose = require('mongoose');

const DB_URI = 'mongodb://localhost:27017/auth_cenfotec';

mongoose.connect(DB_URI, {})

  .then(console.log("[LOG] DB CONNECT"))
  .catch(err => console.log(err))


