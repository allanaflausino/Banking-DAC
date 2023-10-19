require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
var http = require('http');
const express = require('express');
const httpProxy = require('express-http-proxy')
const app = express()
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var logger = require('morgan');
const helmet = require('helmet');

app.use(bodyParser.urlencoded({extended: false}))
app.use( bodyParser.json())

const usuariosServiceProxy = httpProxy('http://localhost:5000/usuarios');
const boisServiceProxy = httpProxy('http://localhost:5001/bois');

function verifyJWT(req, res, next)
{
    const token = req.headers['x-access-token'];
    if(!token)
        return res.status(401).json({auth: false, message: 'Token nao fornecido'});

    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if(err)
            return res.status(500).json({auth:false, message: 'Falha ao autenticar o token'});

            req.userId = decoded.id;
            next();
    })
}

//app.post('/login', urlencodedParser, (req, res, next) =>{
    app.post('/login', (req, res, next) => {
        /* authServiceProxy(req, res, next); */
    if(req.body.user === 'admin' && req.body.password === 'admin')
    {
        const id = 1;
        const token = jwt.sign({id}, process.env.SECRET, {
            expiresIn: 300
        });
        return res.json({auth:true, token:token });
    }
    res.status(500).json({message: 'Login invalido'});
})

app.post('/logout', function(req, res)
    {
        res.json({ auth: false, token: null});
    })

app.get('/usuarios', verifyJWT, (req, res, next) =>{
    usuariosServiceProxy(req, res, next);
})

app.get('/bois', verifyJWT, (req, res, next) =>{
    boisServiceProxy(req, res, next);
})

app.use(logger('dev'));
app.use(helmet());
app.use(express.json())
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
console.log("server rodando");
var server = http.createServer(app);
server.listen(3000);