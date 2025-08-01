const mongoose = require('mongoose');

const DB_URI = 'mongodb://localhost:27017/NuevaDBM';

//              donde, acción
mongoose.connect(DB_URI,{})

    .then(console.log("DB conectada"))
    .catch(err => console.log("ERROR",err))


// Schema

const usuariosSchema = mongoose.Schema({
    nombre:String, //--- 5215 --int str--- "5215"
    telefono:Number, //-- "854126" --STR-INT-- 854126 // "85S1DFF" --error
    direccion:String
},{versionKey:false});


// Model                            nombreColle y esquema
const usuarioModel = mongoose.model('Usuarios',usuariosSchema);

//CRUD
//Create

const crear = async()=>{
    const usuario = new usuarioModel({
        nombre: 54128,
        telefono: "7842151",
        direccion:"Cartago"
    })

    await usuario.save();

    console.log("El usuario se registro");
}

//Read
const mostrar = async()=>{
    const usuarios = await usuarioModel.find();
    console.log(usuarios[1].direccion);
}

//Update

const actualizar = async(id)=>{
    //                          identifico, set
    await usuarioModel.updateOne({_id:id},
        {
            $set:{
                nombre: "steph",
                direccion:"San José"
            }
        })
}

//Delete

const eliminar= async(id)=>{
    await usuarioModel.deleteOne({_id:id});
}


//Llamados
//crear();
mostrar();
//actualizar('688a7bf0d72252733f5e8e18');
eliminar('688a7bc01d85a8b51c8325fe');