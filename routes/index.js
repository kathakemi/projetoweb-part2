const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const jwt = require("jsonwebtoken");
const path = require("path");
const bcrypt = require("bcryptjs")
const mongo = require("mongodb");

let mensagem = [];

require("../models/postagem");
const Postagem = mongoose.model('postagens')

require("../models/usuarios");
const Usuario = mongoose.model('usuarios')


const segredo = "usuario";
const segredoAdmin = "usuariomaster";

function verifyJWT(req, res, next) {
  var token = req.cookies && req.cookies.token ? req.cookies.token : undefined;
  if (!token)
    return res.status(401).send({ auth: false, message: "No token provided." });

  jwt.verify(token, segredo, function(err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });

    req.userId = decoded.id;
    next();
  });
}

function verifyJWTAdmin(req, res, next) {
  var token = req.cookies && req.cookies.admin ? req.cookies.admin : undefined;
  if (!token)
    return res.status(401).send({ auth: false, message: "No token provided." });

  jwt.verify(token, segredoAdmin, function(err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });

    req.userId = decoded.id;
    next();
  });
}


//passando para outras telas
router.get('/', (req, res) => {    
    Postagem.find({texto: new RegExp(req.body.search)}).then((musicas) => {
        res.render('index', {musicas: musicas});
    }).catch((err) => {
        console.log('As músicas não foram carregadas')
    }) 
    res.clearCookie("admin");
    res.clearCookie("token");
    res.clearCookie("userid");
})

router.get('/cadastro', (req, res) => {
    res.render('cadastro')
})

router.get('/sair', (req, res) => {
    res.render('index')
})

router.route('/pesquisa').get(verifyJWT, (req, res) => {
    res.render('pesquisar')
})

//realizando operações no bd

router.post('/cadastrar', (req, res) => {
    var erros = []

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Dado inválido"})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Dado inválido"})
    }
    if(!req.body.datanasc || typeof req.body.datanasc == undefined || req.body.datanasc == null){
        erros.push({texto: "Dado inválido"})
    }
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Dado inválido"})
    }
    if(!req.body.rua || typeof req.body.rua == undefined || req.body.rua == null){
        erros.push({texto: "Dado inválido"})
    }
    if(!req.body.numero || typeof req.body.numero == undefined || req.body.numero == null){
        erros.push({texto: "Dado inválido"})
    }
    if(!req.body.complemento || typeof req.body.complemento == undefined || req.body.complemento == null){
        erros.push({texto: "Dado inválido"})
    }
    if(!req.body.cidade || typeof req.body.cidade == undefined || req.body.cidade == null){
        erros.push({texto: "Dado inválido"})
    }
    if(!req.body.estado || typeof req.body.estado == undefined || req.body.estado == null){
        erros.push({texto: "Dado inválido"})
    }
    if(!req.body.pais || typeof req.body.pais == undefined || req.body.pais == null){
        erros.push({texto: "Dado inválido"})
    }

    if(erros.length > 0){
        res.render('cadastro')
        console.log('Dados inválidos')
    }
    else{

        Usuario.findOne({email: req.body.email}).then((usuario) => {
            if(usuario){
                console.log("Usuario já existente")
                // req.flash("erro_msg", "Já existe este usuário")
                res.render('cadastro')

             }else{
                const novoCadastro = new Usuario({
                    email: req.body.email,
                    senha: req.body.senha,
                    datanasc: req.body.datanasc,
                    nome: req.body.nome,
                    rua: req.body.rua,
                    numero: req.body.numero,
                    complemento: req.body.complemento,
                    cidade: req.body.cidade,
                    estado: req.body.estado,
                    pais: req.body.pais
                })
                bcrypt.genSalt(10, (erro, salt)=>{
                    bcrypt.hash(novoCadastro.senha, salt, (erro, hash) =>{
                        if(erro){
                            res.render('index')
                        }
                        new Usuario(novoCadastro).save().then(() =>{
                               res.redirect('/')
                            }).catch((err) =>{
                              console.log("Erro durante o cadastro!", err)
                            })      
                    })
                })
            
                //new Usuario(novoCadastro).save().then(function () {
                    //res.flash("sucesso_msg", "Sucesso!"),
                    //console.log("Usuario cadastrado com sucesso!")
                //})
            }
        })        
    }
})


//new RegExp(/(query)*/

router.post('/pesquisa', (req, res) => {
    var query = req.query.pesq;
    Postagem.find({texto: new RegExp(query)}).then((items) => {
        res.render('pesquisar', {items: items})
    }).catch((err) => {
        console.log('As músicas não foram carregadas')
        res.render('home',  {email: [{email: user.email}], usuario: [{usuario: user._id}], datanasc: [{datanasc: user.datanasc}], pais: [{pais: user.pais}]})
    }) 
})

/*router.get('/', (req, res) => {    
    res.redirect('pesquisar');
  });*/
  
  router.route('/postagem').get(verifyJWTAdmin, (req, res) => {
    res.render('postagem', { user: req.cookies.userid });
  });
  
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/uploads/');
    },
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    }
});
var upload = multer({ storage: storage });

router
  .route('/postar')
  .post(verifyJWTAdmin, upload.single("imagem"), (req, res) => {
    console.log("BODY", req.body);
    console.log("IMAGEM", req.file);
    if (req.body) {
      let mensagem = [];
      if (
        req.body.texto === "" ||
        req.body.texto === null ||
        req.body.texto === undefined
      ) {
        console.log("O campo titulo é obrigatório!");
      }
      if (
        req.cookies.userid === "" ||
        req.cookies.userid === null ||
        req.cookies.userid === undefined
      ) {
        console.log("Author não informado!");
      }

      if (mensagem.length > 0) {
        res.render('postar', { mensagem });
      } else {
        console.log("FILE", req.file);
        console.log("BODY", req.body);
        let newPost = new Postagem({
          texto: req.body.texto.trim(),
          author: req.cookies.userid,
          imagem: req.file !== undefined ? "/uploads/" + req.file.filename : null
        });

        newPost.save().then(user => {
          res.render('home',  {email: [{email: user.email}], usuario: [{usuario: user._id}], datanasc: [{datanasc: user.datanasc}], pais: [{pais: user.pais}]});
          console.log('Musica salva com sucesso!')
        });
      }
    }
  });

router.get('/login', (req, res) => {
    if (req.cookies.token) {
        res.redirect("/home");
    } else {
      res.render('index');
    }
});

router.post('/login', (req, res) => {
    if (req.body) {
        let mensagem = [];
        if (req.body.login === '' || req.body.login === null) {
          mensagem.push('O campo email é obrigatório!');
        }
        if (req.body.senha === '' || req.body.senha === null) {
          mensagem.push('O campo senha é obrigatório!');
        }
    
        if (mensagem.length > 0) {
          res.render('index', { mensagem });
        } 
        else {
            require("../models/usuarios")
            const Usuario = mongoose.model('usuarios')
            Usuario.find({
                email: req.body.login,
                senha: req.body.senha
          }).then(result => {
                if (result.length !== 0) {
                    const user = result[0];
    
                    var token = jwt.sign({ id: user._id }, segredo, {
                        expiresIn: 300
                    });
                    console.log(user.adm)
                    res.cookie("token", token);
                    res.cookie("userid", user._id);
                    if (user.adm === 1) {
                        var tokenAdmin = jwt.sign(
                        { id: user._id, senha: user.senha },
                        segredoAdmin,
                        {
                            expiresIn: 300
                        }
                        );
    
                        res.cookie("admin", tokenAdmin);
                    }
                    res.status(200).render('home', {email: [{email: user.email}], usuario: [{usuario: user._id}], datanasc: [{datanasc: user.datanasc}], pais: [{pais: user.pais}]});
                } 
                else {
                    res.render('index', {
                        mensagem: ["Dados de cadastro incorretos!"]
                    });
                }
            });
        }
      }
  });

module.exports = router