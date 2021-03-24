const { Client } = require('pg');


const pgClient = new Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
});

pgClient.connect();

exports.pgClient = pgClient;
