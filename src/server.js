require("dotenv").config();
const express = require("express");
const cors = require("cors");

const errorMiddleware = require("./middleware/error-middleware");
const authRouter = require("./routers/auth.routes.js");
const mapRouter = require("./routers/map.routes.js");
const likeRouter = require("./routers/like.routes.js");

const config = require("./config/app-config")[process.env.NODE_ENV || "development"];
const auth = require("./utils/auth/passport");

const app = express();

app.use(auth.initialize);
app.use(cors({ origin: config.app.clientDomain }));
app.use(express.json());

app.use('/', authRouter);
app.use('/map', mapRouter);
app.use('/like', likeRouter);

app.use(errorMiddleware);

module.exports = app;