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

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// proxys - usado para invocar os serviços, caso autenticado
const clienteServiceProxy = httpProxy("http://localhost:5000");

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

app.post('/login', urlencodedParser, (req, res, next) => {
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

app.get('/clientes', verificaJwt, (req, res, next) => {
  clienteServiceProxy(req, res, next)
})

// configura aplicação
app.use(logger("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// cria o servidor na porta 3000
var server = http.createServer(app);
server.listen(3000);

