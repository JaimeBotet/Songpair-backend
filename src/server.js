const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { json } = require("body-parser");
const config = require("./config/app-config")[process.env.NODE_ENV || "development"];

require("dotenv").config();

const app = express();

const errorMiddleware = require("./middleware/error-middleware");
const authRouter = require("./routers/auth.routes.js");

const auth = require("./utils/auth/passport");

app.use(morgan("dev"));
app.use(helmet());
app.use(json());

app.use(cors({ origin: config.app.clientDomain }));

app.use(auth.initialize);

app.use('/', authRouter);

app.use(errorMiddleware);

module.exports = app;