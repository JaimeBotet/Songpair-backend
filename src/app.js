require("dotenv").config();

const app = require("./server");

const config = require("./config/app-config")[process.env.NODE_ENV || "development"];

app.listen(config.app.port, () => {
    console.log(`Server listening on http://localhost:${config.app.port}`);
});