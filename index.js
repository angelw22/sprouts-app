const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 8000
const { Client } = require('pg');
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.options('*', cors()); 
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const pgClient = new Client({
  // database: process.env.DB_NAME,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // host: process.env.DB_HOST,
  // port: process.env.DB_PORT
  database: 'sproutsdb',
  user: 'sprouts_admin', 
  password: 'sprouts',
  host: 'localhost', 
  port: '5432'
});

pgClient.connect();

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

//retrieve user name from id
app.post('/api/user', (req, response) => {
  console.log('req body is', req.body)
  let text = `SELECT user_name, user_role FROM users WHERE user_id = '${parseInt(req.body.user_id)}';`
  pgClient.query(text)
  .then(dbResponse => {
    console.log('dbresponse is ', typeof dbResponse.rows[0])
    response.status(200).json(JSON.stringify(dbResponse.rows[0]))
  })
  .catch(e => {
    response.status(200).send({ ok: false });
    console.error(e.stack)
  })
  // response.json(req.body.user_id)
})

app.post('/api/studentdata', (req, response) => {
  let text = `SELECT val_responsibility FROM students WHERE user_id = '${req.body.user_id}';`
  pgClient.query(text)
  .then(dbResponse => {
    response.status(200).json(dbResponse.rows[0])
    // response.status(200).send(dbResponse.rows[0])
  })
  .catch(e => {
    response.status(200).send({ ok: false });
    console.error(e.stack)
  })
})


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
      res.send(200);
  } else {
      next();
  }
};
app.use(allowCrossDomain);








