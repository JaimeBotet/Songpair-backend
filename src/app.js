import express from 'express';
import cors from 'cors';
import config from './config/app-config.js'
import authRouter from './routers/auth.routes.js'

const app = express();

app.use(cors({ origin: config.app.clientDomain }));
app.use(express.json());

app.use('/', authRouter);

app.listen(config.app.port);