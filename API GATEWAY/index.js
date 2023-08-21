const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const http = require('http');
const express = require('express');
const httpProxy = require('express-http-proxy');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const PORT = 5000;
dotenv.config({ path: `${process.env.NODE_ENV !== undefined ? '.env.dev' : '.env'}` });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(helmet());
app.use(cookieParser());
app.use(cors());

const loginServiceProxy = httpProxy(process.env.HOST_AUTENTICACAO, {
  proxyReqBodyDecorator: function (bodyContent, srcReq) {
    try {
      const { login, senha } = bodyContent;
      const retBody = {};
      retBody.email = login;
      retBody.senha = senha;
      bodyContent = retBody;
      console.log(bodyContent)
    } catch (e) {
      console.log('ERRO: ' + e);
    }
    return bodyContent;
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.method = 'POST';
    return proxyReqOpts;
  },
  userResDecorator: function (proxyRes, proxyResData, request, response) {
   console.log(request.body)
    if (proxyRes.statusCode === 200) {
      const bodyStr = Buffer.from(proxyResData).toString('utf-8');
      const body = JSON.parse(bodyStr);
      const id = body.id;
      const token = jwt.sign({ id }, process.env.SECRET, { expiresIn: 36000 });
      response.status(200);
      return { auth: true, token, data: body };
    } else {
      console.log
      response.status(401);
      return { message: 'Login inválido!' };
    }
  },
});

function verificaJwt(req, res, next) {
  const token = req.headers['x-access-token'];
  console.log(req.headers, token);
  if (!token) return res.status(401).json({ auth: false, message: 'Token inválido' });

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    console.log("Token:"+token)
    if (err) return res.status(500).json({ auth: false, message: 'Falha de autenticacao' });
    req.userId = decoded.id;
    next();
  });
}


app.post(process.env.PATH_AUTENTICACAO + '/login', (req, res, next) => {
  console.log(req.body);
  //return res.json(req.body);
   loginServiceProxy(req, res, next);
});

app.post(process.env.PATH_AUTENTICACAO + '/logout', verificaJwt, (req, res) => {
  res.json({ auth: false, token: null });
});

app.get(process.env.PATH_AUTENTICACAO + '/lista', verificaJwt, async (req, res, next) => {
  httpProxy(process.env.HOST_AUTENTICACAO, {
    proxyReqBodyDecorator: function (bodyContent, srcReq) {
      return bodyContent;
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      proxyReqOpts.headers['Content-Type'] = 'application/json';
      return proxyReqOpts;
    },
    userResDecorator: function (proxyRes, proxyResData, request, response) {
      if (proxyRes.statusCode === 200) {
        const bodyStr = Buffer.from(proxyResData).toString('utf-8');
        const body = JSON.parse(bodyStr);
        response.status(200);
        return { usuarios: body };
      } else {
        response.status(401);
        return { message: 'Um erro ocorreu ao buscar usuários.' };
      }
    },
  })(req, res, next);
});

app.get(`${process.env.PATH_AUTENTICACAO}/:id`, verificaJwt, (req, res, next) => {
  httpProxy(process.env.HOST_AUTENTICACAO, {
    userResDecorator: function (proxyRes, proxyResData, request, response) {
      if (proxyRes.statusCode == 200) {
        var bodyStr = Buffer.from(proxyResData).toString('utf-8');
        response.status(200);
        return bodyStr;
      } else {
        response.status(proxyRes.statusCode);
        return { message: 'Um erro ocorreu ao buscar o usuário.' };
      }
    },
  })(req, res, next);
});

app.get(process.env.PATH_CLIENTE + '/lista', verificaJwt, (req, res, next) => {
  httpProxy(process.env.HOST_CLIENTE, {
    proxyReqBodyDecorator: function (bodyContent, srcReq) {
      return bodyContent;
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      proxyReqOpts.headers['Content-Type'] = 'application/json';
      return proxyReqOpts;
    },
    userResDecorator: function (proxyRes, proxyResData, request, response) {
      if (proxyRes.statusCode === 200) {
        const bodyStr = Buffer.from(proxyResData).toString('utf-8');
        const body = JSON.parse(bodyStr);
        response.status(200);
        return { clientes: body };
      } else {
        response.status(401);
        return { message: 'Um erro ocorreu ao buscar clientes.' };
      }
    },
  })(req, res, next);
});

app.get(`${process.env.PATH_CLIENTE}/:cpf`, verificaJwt, (req, res, next) => {
  httpProxy(process.env.HOST_CLIENTE, {
    userResDecorator: function (proxyRes, proxyResData, request, response) {
      if (proxyRes.statusCode == 200) {
        var bodyStr = Buffer.from(proxyResData).toString('utf-8');
        response.status(200);
        return bodyStr;
      } else {
        response.status(proxyRes.statusCode);
        return { message: 'Um erro ocorreu ao buscar o cliente.' };
      }
    },
  })(req, res, next);
});

app.get(`${process.env.PATH_CLIENTE}/:email`, verificaJwt, (req, res, next) => {
  httpProxy(process.env.HOST_CLIENTE, {
    userResDecorator: function (proxyRes, proxyResData, request, response) {
      if (proxyRes.statusCode == 200) {
        var bodyStr = Buffer.from(proxyResData).toString('utf-8');
        response.status(200);
        return bodyStr;
      } else {
        response.status(proxyRes.statusCode);
        return { message: 'Um erro ocorreu ao buscar o cliente.' };
      }
    },
  })(req, res, next);
});

app.get(`${process.env.PATH_CLIENTE}/:id`, verificaJwt, (req, res, next) => {
  httpProxy(process.env.HOST_CLIENTE, {
    userResDecorator: function (proxyRes, proxyResData, request, response) {
      if (proxyRes.statusCode == 200) {
        var bodyStr = Buffer.from(proxyResData).toString('utf-8');
        response.status(200);
        return bodyStr;
      } else {
        response.status(proxyRes.statusCode);
        return { message: 'Um erro ocorreu ao buscar o cliente.' };
      }
    },
  })(req, res, next);
});




app.get(process.env.PATH_CONTA + '/lista', verificaJwt, (req, res, next) => {
  httpProxy(process.env.HOST_CONTA, {
    proxyReqBodyDecorator: function (bodyContent, srcReq) {
      return bodyContent;
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      proxyReqOpts.headers['Content-Type'] = 'application/json';
      return proxyReqOpts;
    },
    userResDecorator: function (proxyRes, proxyResData, request, response) {
      if (proxyRes.statusCode === 200) {
        const bodyStr = Buffer.from(proxyResData).toString('utf-8');
        const body = JSON.parse(bodyStr);
        response.status(200);
        return { clientes: body };
      } else {
        response.status(401);
        return { message: 'Um erro ocorreu ao buscar contas.' };
      }
    },
  })(req, res, next);
});

app.get(`${process.env.PATH_CONTA}/:userId`, verificaJwt, (req, res, next) => {
  httpProxy(process.env.HOST_CONTA, {
    userResDecorator: function (proxyRes, proxyResData, request, response) {
      if (proxyRes.statusCode == 200) {
        var bodyStr = Buffer.from(proxyResData).toString('utf-8');
        response.status(200);
        return bodyStr;
      } else {
        response.status(proxyRes.statusCode);
        return { message: 'Um erro ocorreu ao buscar a conta do usuário.' };
      }
    },
  })(req, res, next);
});

app.get(`${process.env.PATH_CONTA}/:gerenteId`, verificaJwt, (req, res, next) => {
  httpProxy(process.env.HOST_CONTA, {
    proxyReqBodyDecorator: function (bodyContent, srcReq) {
      return bodyContent;
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      proxyReqOpts.headers['Content-Type'] = 'application/json';
      return proxyReqOpts;
    },
    userResDecorator: function (proxyRes, proxyResData, request, response) {
      if (proxyRes.statusCode === 200) {
        const bodyStr = Buffer.from(proxyResData).toString('utf-8');
        const body = JSON.parse(bodyStr);
        response.status(200);
        return { clientes: body };
      } else {
        response.status(401);
        return { message: 'Um erro ocorreu ao buscar contas por gerente.' };
      }
    },
  })(req, res, next);
});

app.get(`${process.env.PATH_CONTA}/:gerenteId`, verificaJwt, (req, res, next) => {
  httpProxy(process.env.HOST_CONTA, {
    proxyReqBodyDecorator: function (bodyContent, srcReq) {
      return bodyContent;
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      proxyReqOpts.headers['Content-Type'] = 'application/json';
      return proxyReqOpts;
    },
    userResDecorator: function (proxyRes, proxyResData, request, response) {
      if (proxyRes.statusCode === 200) {
        const bodyStr = Buffer.from(proxyResData).toString('utf-8');
        const body = JSON.parse(bodyStr);
        response.status(200);
        return { clientes: body };
      } else {
        response.status(401);
        return { message: 'Um erro ocorreu ao buscar contas pendentes por gerente.' };
      }
    },
  })(req, res, next);
});

app.get(`${process.env.PATH_CONTA}/:id`, verificaJwt, (req, res, next) => {
  httpProxy(process.env.HOST_CONTA, {
    userResDecorator: function (proxyRes, proxyResData, request, response) {
      if (proxyRes.statusCode == 200) {
        var bodyStr = Buffer.from(proxyResData).toString('utf-8');
        response.status(200);
        return bodyStr;
      } else {
        response.status(proxyRes.statusCode);
        return { message: 'Um erro ocorreu ao buscar a conta.' };
      }
    },
  })(req, res, next);
});

//TRANSACAO
app.post('/transacoes', (req, res, next) => {
  httpProxy('http://localhost:5003', {
    proxyReqBodyDecorator: function (bodyContent, srcReq) {
      return bodyContent;
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      proxyReqOpts.headers['Content-Type'] = 'application/json';
      proxyReqOpts.method = 'POST';
      return proxyReqOpts;
    },
    userResDecorator: function (proxyRes, _proxyResData, request, response) {
      if (proxyRes.statusCode == 200) {
        response.status(200);
        return { message: 'Transacao inserida com sucesso.' };
      } else {
        response.status(proxyRes.statusCode);
        return { message: 'Um erro ocorreu ao inserir transação!!!' };
      }
    },
  })(req, res, next);
});

app.get('/transacoes', (req, res, next) => {
  httpProxy('http://localhost:5003', {
    proxyReqBodyDecorator: function (bodyContent, srcReq) {
      return bodyContent;
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      proxyReqOpts.headers['Content-Type'] = 'application/json';
      proxyReqOpts.method = 'GET';
      return proxyReqOpts;
    },
    userResDecorator: function (proxyRes, proxyResData, request, response) {
      if (proxyRes.statusCode === 200) {
        const bodyStr = Buffer.from(proxyResData).toString('utf-8');
        const body = JSON.parse(bodyStr);
        response.status(200);
        return body;
      } else {
        response.status(401);
        return { message: 'Erro transacoes.' };
      }
    },
  })(req, res, next);
});



app.put(`${process.env.PATH_GERENTE}/:id`, verificaJwt, (req, res, next) => {
  httpProxy(process.env.HOST_GERENTE, {
    userResDecorator: function (proxyRes, proxyResData, request, response) {
      if (proxyRes.statusCode == 200) {
        var bodyStr = Buffer.from(proxyResData).toString('utf-8');
        response.status(200);
        return bodyStr;
      } else {
        response.status(proxyRes.statusCode);
        return { message: 'Um erro ocorreu ao alterar o gerente.' };
      }
    },
  })(req, res, next);
});


app.get(process.env.PATH_GERENTE + '/lista', verificaJwt, (req, res, next) => {
  httpProxy(process.env.HOST_GERENTE, {
    proxyReqBodyDecorator: function (bodyContent, srcReq) {
      return bodyContent;
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      proxyReqOpts.headers['Content-Type'] = 'application/json';
      return proxyReqOpts;
    },
    userResDecorator: function (proxyRes, proxyResData, request, response) {
      if (proxyRes.statusCode === 200) {
        const bodyStr = Buffer.from(proxyResData).toString('utf-8');
        const body = JSON.parse(bodyStr);
        response.status(200);
        return { gerentes: body };
      } else {
        response.status(401);
        return { message: 'Um erro ocorreu ao buscar gerentes.' };
      }
    },
  })(req, res, next);
});

app.get(`${process.env.PATH_GERENTE}/:cpf`, verificaJwt, (req, res, next) => {
  httpProxy(process.env.HOST_GERENTE, {
    userResDecorator: function (proxyRes, proxyResData, request, response) {
      if (proxyRes.statusCode == 200) {
        var bodyStr = Buffer.from(proxyResData).toString('utf-8');
        response.status(200);
        return bodyStr;
      } else {
        response.status(proxyRes.statusCode);
        return { message: 'Um erro ocorreu ao buscar o gerente.' };
      }
    },
  })(req, res, next);
});

app.get(`${process.env.PATH_GERENTE}/:email`, verificaJwt, (req, res, next) => {
  httpProxy(process.env.HOST_GERENTE, {
    userResDecorator: function (proxyRes, proxyResData, request, response) {
      if (proxyRes.statusCode == 200) {
        var bodyStr = Buffer.from(proxyResData).toString('utf-8');
        response.status(200);
        return bodyStr;
      } else {
        response.status(proxyRes.statusCode);
        return { message: 'Um erro ocorreu ao buscar o gerente.' };
      }
    },
  })(req, res, next);
});

app.get(`${process.env.PATH_GERENTE}/:id`, verificaJwt, (req, res, next) => {
  httpProxy(process.env.HOST_GERENTE, {
    userResDecorator: function (proxyRes, proxyResData, request, response) {
      if (proxyRes.statusCode == 200) {
        var bodyStr = Buffer.from(proxyResData).toString('utf-8');
        response.status(200);
        return bodyStr;
      } else {
        response.status(proxyRes.statusCode);
        return { message: 'Um erro ocorreu ao buscar o gerente.' };
      }
    },
  })(req, res, next);
});

const server = http.createServer(app);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
