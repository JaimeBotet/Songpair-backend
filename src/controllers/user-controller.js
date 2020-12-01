const passport = require("passport");

const db = require("../models");
const getSanitizedUser = require("../utils/auth/getSanitizedUser");

async function signUp(req, res, next) {
  passport.authenticate("signup", async (error, user, info) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return res.status(400).send({
        data: null,
        error: "Already signed up",
      });
    }

    const {
      name,
      email,
      password,
      avatar,
      spotifyID,
      location,
      token,
      refreshToken
    } = req.body;

    if (!name || !avatar || !email || !password) {
      res.status(400).send({
        data: null,
        error: "Missing Fields",
      });
    }

    req.login(user, { session: false }, async (error) => {
      if (error) return next(error);

      const newUser = await db.User.create({
        name: name,
        avatar: avatar,
        email: email,
        password: password,
        spotifyID: spotifyID,
        location: location,
        token: token,
        refreshToken: refreshToken
      }).catch((error) => {
        return next(error);
      });

      await newUser.save().catch(next);

      const sanitizedUser = getSanitizedUser(newUser.toObject());

      res.status(201).send({
        data: {
          user: sanitizedUser,
          token: token,
        },
        error: null,
      });
    });
  })(req, res, next);
}

module.exports = {
  signUp
};