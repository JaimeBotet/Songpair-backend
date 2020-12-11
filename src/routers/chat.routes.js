const express = require("express");
const passport = require("passport");
require("dotenv").config();

const router = express.Router();

const userController = require("../controllers/user-controller");

router.get(
  "/:id",
  passport.authenticate("bearer",{ session: false}),
  userController.getChats
);


module.exports = router;