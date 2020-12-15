const express = require("express");
const passport = require("passport");
require("dotenv").config();

const router = express.Router();
const userController = require("../controllers/user-controller");

router.post(
  "/near-people",
  passport.authenticate("bearer",{ session: false}),
  userController.nearPeople
);

router.post(
  "/update-position",
  passport.authenticate("bearer",{ session: false}),
  async (req, res, next) => {
    await userController.updateUserLocation(req, res, next);
    return res.status(200).send({data: true, error: null});
});

module.exports = router;