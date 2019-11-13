if (process.env.NODE_ENV == "production") {
    module.exports = { mongoURI:"mongodb+srv://nathalia:projetoweb2@projetoweb2-nm6mu.mongodb.net/test?retryWrites=true&w=majority"}
} else {
    module.exports = { mongoURI: "mongodb://localhost/projetospotify"}
}