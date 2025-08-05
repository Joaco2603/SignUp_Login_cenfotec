const mongoose = require('mongoose');

//Schema
let userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { versionKey: false });

//Model
let user = new mongoose.model('Users', userSchema);

module.exports = user;
