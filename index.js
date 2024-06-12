// importing
import express from 'express';
import dotenv from 'dotenv';
import pg from 'pg';
import { identifyUser } from './source/handler.js';
import swStats from 'swagger-stats';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';



// load environment variables from .env file
dotenv.config();

// app config
const app = express();
const port = process.env.PORT || 8001;

// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// swagger-stats
app.use(swStats.getMiddleware({
  swaggerSpec: swaggerSpec,
  uriPath: "/swagger-stats",
  swagger: true
}));
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

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Checks if the server is running
 *     responses:
 *       200:
 *         description: Server is up and running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.get('/ping', (req, res) => res.status(200).send({ message: `Hey! Working good! Listening on Port:${port}` }));

/**
 * @swagger
 * /identify:
 *   post:
 *     summary: Identifies a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: User identified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contact:
 *                   type: object
 *                   properties:
 *                     primaryContatctId:
 *                       type: integer
 *                     emails:
 *                       type: array
 *                       items:
 *                         type: string
 *                     phoneNumbers:
 *                       type: array
 *                       items:
 *                         type: string
 *                     secondaryContactIds:
 *                       type: array
 *                       items:
 *                         type: integer
 */
app.post('/identify', (req, res) => {
  identifyUser(req.body, res);
});

// listeners
app.listen(port, () => {console.log(`listening on Port:${port}`);});


export { client, app };