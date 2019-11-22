// Módulos
var express = require('express');
var mongoose = require('mongoose');
var app = express();
var index = require('./routes/index.js');
const path = require("path")
multer = require('multer');
const db = require('./config/db')
const cookieParser = require('cookie-parser');
const http = require("http");
const porta = process.env.PORT || 3000;


app.use(cookieParser());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

mongoose.Promise = global.Promise;

mongoose.connect(db.mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,}).then(() => {
    console.log("MongoDB conectado - Projeto Spotify")
}).catch((err) => {
    console.log("Erro ao conectar: " + err)
})

app.use("/", index);

http.createServer(app).listen(porta);