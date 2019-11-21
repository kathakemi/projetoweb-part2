const mongoose = require("mongoose")
const Schema = mongoose.Schema


const usuario =  new Schema({
    id:{
        type: Object
    },
    
    nome: {
        type: String,
        require: true
    },

    datanasc: {
        type: String,
        require: true
    },

    rua: {
        type: String,
        require: true
    },

    numero: {
        type: String,
        require: true
    },

    complemento: {
        type: String,
        require: true
    },

    cidade: {
        type: String,
        require: true
    },

    estado: {
        type: String,
        require: true
    },

    pais: {
        type: String,
        require: true
    },

    email: {
        type: String,
        require: true
    },

    senha: {
        type: String,
        require: true
    },

    adm :{

        type: Number,
        default:0

    }     
 
})

mongoose.model('usuarios', usuario)
