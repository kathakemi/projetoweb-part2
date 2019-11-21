const mongoose = require("mongoose")
const Schema = mongoose.Schema

const postagem = new Schema({
    texto: {
        type: String,
        require: true
    },
    author: {
        type: String,
        require: true
    },
    imagem: {
        type: String
    }
})

mongoose.model('postagens', postagem)