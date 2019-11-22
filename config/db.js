if (process.env.NODE_ENV == "production") {
    module.exports = { mongoURI:"mongodb+srv://kathakemi:senha123@cluster0-4bhlr.mongodb.net/projetospotify?retryWrites=true&w=majority"}
} else {
    module.exports = { mongoURI: "mongodb://localhost/projetospotify"}
}