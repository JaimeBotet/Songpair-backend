const express = require("express");
const passport = require("passport");

const router = express.Router();

const userController = require("../controllers/user-controller");

router.get(
  '/:id',
  passport.authenticate("bearer",{ session: false}),
  userController.getProfile
);

module.exports = router;