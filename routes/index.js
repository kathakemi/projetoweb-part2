const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const jwt = require("jsonwebtoken");

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
    res.render('index')
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


router.post('/cadastrar').get(verifyJWT, (req, res) => {
    var erros = []

    if(!req.body.login || typeof req.body.login == undefined || req.body.login == null){
        erros.push({texto: "Dado inválido"})
    }
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
        console.login('Dados inválidos')
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
                        novoCadastro.save().then(() =>{
                            req.flash("sucesso_msg", "Usuário válido")
                            res.redirect('index')
                            }).catch((err) =>{
                                req.flash("erro_msg", "erro")
                            })      
                    })
                })
            
                new Usuario(novoCadastro).save().then(function () {
                    //res.flash("sucesso_msg", "Sucesso!"),
                    console.log("Usuario cadastrado com sucesso!")
                })
            }
        })        
    }
})

router.post('/pesquisa', (req, res) => {
    var query = req.body.pesq;
    Postagem.find({texto: query }).then((postagens) => {
        res.render('pesquisar', {postagens: postagens})
    }).catch((err) => {
        console.log('As músicas não foram carregadas')
        res.redirect('index')
    }) 
})

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/imagens/')
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

router.get('/', (req, res) => {
    res.render('index');
  });
  
  router.route('/postagem').get(verifyJWTAdmin, (req, res) => {
    res.render('postagem', { user: req.cookies.userid });
  });
  
  router.post('/postar', (req, res) => {
    let upload = multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
            let ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                return callback(mensagem.push('Por favor, coloque apenas imagens!'), null);                
            }
            const nomearquivo = file.originalname;
            callback(null, true);
        }
    }).single('imagem');

    upload(req, res, function (err) {

        const novaPostagem = {
            texto: req.body.texto,
            author: req.cookies.userid
        }
        new Postagem(novaPostagem).save().then(function () {
            res.render('home')
            console.log('Sua música foi postada com sucesso!')
        }).catch((err) => {
            console.log('Ocorreu um erro durante a postagem!')
        })
    })
})

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
    
                    res.status(200).render('home');
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