require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRouter = require("./routers/auth.routes.js");

const config = require("./config/app-config")[process.env.NODE_ENV || "development"];
const auth = require("./utils/auth/passport");

const app = express();

app.use(auth.initialize);
app.use(cors({ origin: config.app.clientDomain }));
app.use(express.json());

app.use('/', authRouter);

module.exports = app;