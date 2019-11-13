const mongoose = require("mongoose")
const Schema = mongoose.Schema

const postagem = new Schema({
    texto: {
        type: String,
        require: true
    },
    imagem: {
        type: String,
        default: "Sem imagem"
    },
    author: {
        type: String,
        require: true
    }
})

mongoose.model('postagens', postagem)