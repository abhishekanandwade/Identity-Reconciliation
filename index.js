// importing
import express from 'express';
import dotenv from 'dotenv';
import pg from 'pg';
import { identifyUser } from './source/handler.js';


// load environment variables from .env file
dotenv.config();

// app config
const app = express();
const port = process.env.PORT || 8001;

// middleware
app.use(express.json());

//DB config
const { Pool } = pg;
const client = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect((err) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to the database');
});

//API Endpoint
app.get('/ping', (req, res) => res.status(200).send({ message: `Hey! Woriking good! Listening on Port:${port}` }));

//API Endpoint to identify the user
app.post('/identify', (req, res) => {
  identifyUser(req.body, res);
});


// listeners
app.listen(port, () => {console.log(`listening on Port:${port}`);});


export { client, app };