// importing
import express from 'express';
import dotenv from 'dotenv';

// load environment variables from .env file
dotenv.config();

// app config
const app = express();
const port = process.env.PORT || 8001;

// middleware
app.use(express.json());

//API Endpoint
app.get('/', (req, res) => res.status(200).send(
    {
        message: "Hey! Woriking good!"
    }
));

// listeners
app.listen(port, () => console.log(`listening on localhost:${port}`));