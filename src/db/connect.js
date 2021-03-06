const mongoose = require("mongoose");
require("dotenv").config();

const config = require("../config/app-config")[process.env.NODE_ENV || "development"];

function connect() {
  return mongoose.connect(config.db.url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
}

module.exports = connect;