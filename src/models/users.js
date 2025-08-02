const mongoose = require('mongoose');

const DB_URI = 'mongodb://localhost:27017/LoginTienda';

mongoose.connect(DB_URI,{})

    .then(console.log("DB conect"))
    .catch(err => console.log(err))

//Schema

let userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    last_name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true}
},{versionKey:false});

//Model

let user = new mongoose.model('Users',userSchema);

module.exports = user;