require("dotenv-safe").config();
const jwt = require("jsonwebtoken");
const http = require("http");
const express = require("express");
const httpProxy = require("express-http-proxy");
const app = express();
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
const helmet = require("helmet");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// proxys - usado para invocar os serviços, caso autenticado
const usuariosServiceProxy = httpProxy("http://localhost:5000");
const boisServiceProxy = httpProxy("http://localhost:5001");

function verificaJwt(req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).json({ auth: false, message: "Token inválido" });
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({
        auth: false,
        message: "Falha ao autenticar o token."
      })
    }
    // se estiver tudo certo
    req.userId = decoded.id;
    next();
  });
}

app.post('/login', urlencodeParser, (req, res, next) => {
  if (req.body.user === 'admin' && req.body.password === 'admin') {
    const id = 1;
    const token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 300 // expires in 5min
    });
    return res.json({ auth: true, token: token });
  }
  res.status(500).json({message: "Login inválido."});
})

app.post('/logout', function(req, res) {
  res.json({auth: false, token: null});
})

app.get('/usuarios', verificaJwt, (req, res, next) => {
  usuariosServiceProxy('/usuarios', req, res, next)
})

app.get('/bois', verificaJwt, (req, res, next) => {
  boisServiceProxy(req, res, next)
})


// https://www.youtube.com/watch?v=DIrhIB-unS4