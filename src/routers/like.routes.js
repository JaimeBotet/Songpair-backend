const express = require("express");
const passport = require("passport");
require("dotenv").config();

const router = express.Router();

const likeController = require("../controllers/like-controller");

router.post(
  "/check",
  passport.authenticate("bearer",{ session: false}),
  likeController.check
);

router.post(
  "/update",
  passport.authenticate("bearer",{ session: false}),
  likeController.update
);

module.exports = router;