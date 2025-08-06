const mongoose = require('mongoose');

//Schema
let userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: {type: Date}
}, { versionKey: false });

//Model
let user = mongoose.model('Users', userSchema);

module.exports = user;
