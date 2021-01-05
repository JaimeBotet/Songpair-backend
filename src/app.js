require("dotenv").config();

const app = require("./server");
const socketCon = require('./utils/socket');

const config = require("./config/app-config")[process.env.NODE_ENV || "development"];
const connect = require("./db/connect");

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8080;


connect()
  .then(() => {
    const server = app.listen(port, host, () => {
      console.log(`Server listening on http://localhost:${config.app.port}`);
    });

    socketCon(server);

  })
  .catch((error) => {
    console.error(error);
  });