const express = require("express");
const passport = require("passport");
require("dotenv").config();

const router = express.Router();

const roomController = require("../controllers/room-controller");

router.get(
  "/",
  passport.authenticate("bearer",{ session: false}),
  roomController.getChats
);

router.post(
  "/room",
  passport.authenticate("bearer",{ session: false}),
  roomController.openRoom
);

module.exports = router;