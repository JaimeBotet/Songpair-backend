require("dotenv").config();
const express = require("express");

const router = express.Router();
const userController = require("../controllers/user-controller");

router.post("/near-people", userController.nearPeople);

module.exports = router;