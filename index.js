const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 8000
const cors = require('cors');
const { userData } = require('./api/Users.js');
const { gardenData } = require('./api/gardenData.js');


app.use(cors({
  origin: 'https://sprouts.ngrok.io ',
  credentials: true
}))
app.options('*', cors()); 
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
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

userData(app);
gardenData(app);



