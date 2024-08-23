import express from 'express';
import logger from 'morgan';
import 'dotenv/config'
import cors from "cors";
import { createWriteStream } from 'fs';
import homeRouter from './routes/homeRouter.js';
import { productsRouter } from './routes/productsRouter.js';
import { getErrorStatus } from './controllers/404ErrorController.js';
import userRouter from './routes/userRouter.js';
// import authRouter from './routes/authRouter.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());    

const accessLogStream = createWriteStream('./logs/access.log', { flasgs: 'a' });
//Setup the Logger to write in a file
app.use(logger('combined', { stream: accessLogStream }))


//To access from frontend we write this
const options = {
    origin: ['http://localhost:3000', 'https://localhost:8080'],
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE"
}

app.use(cors(options))

// // default Configuration for cors
// {
//     "origin": "*",
//     "methods": "GET, HEAD, PUT, PATCH, POST, DELETE",
//     "preflightContinue": false,
//     "optionSuccessStatus": 204
// }


// app.get('/hello', (req, res) => res.send("<h1>Hello World!</h1>"));

// app.get('/aboutUs', (req, res) => res.send("<h1>About Us</h1>"));

app.use('/', homeRouter);
// app.use('/products', productsRouter);
app.use('/products/', productsRouter);

app.use('/users/', userRouter);

// app.use('/users/', authRouter)
app.get('*', getErrorStatus);
app.use(errorHandler);

app.listen(port, () => console.log(`Listening at port number ${port}`))

export default app