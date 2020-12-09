const path = require('path');
const express = require('express');
const session = require('express-session');

const PORT = process.env.SERVER_PORT || 3000;
const app = express();

app.use(session({
  secret: 'devpleno',
  resave: false,
  saveUninitialized: true,
  cookie:{
    maxAge: 10*60*1000 //Definimos o tempo de 10 minutos para fechar a sessão
  }
}));
app.use(express.urlencoded({ extended: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  let contas = req.session.contas || [];

  res.render('index', {
    contas
  });
})

app.post('/calc', (req, res) => {
  let total = 0;
  let { num1, num2, op } = req.body;

  num1 = parseInt(num1);
  num2 = parseInt(num2);

  if(op === '+'){
    total = num1 + num2;
  } else if(op === '-'){
    total = num1 - num2;
  } else if(op === '*'){
    total = num1 * num2;
  } else if(op === '/'){
    total = num1 / num2;
  }

  let contas = req.session.contas || []

  contas.push({ num1, num2, op, total })

  // Repare que nas sessions, sempre usamos o req.
  // Nos cookies, que utilizamos res, no momento de atribuir.
  req.session.contas = contas;

  res.redirect('/');
})

app.listen(PORT, error => {
  if(error) {
    console.log('Problemas ao subir servidor.');
  } else {
    console.log('Servidor iniciado com sucesso.');
  }
})