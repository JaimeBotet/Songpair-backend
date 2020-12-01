const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const db = require("../../models");
const getSanitizedUser = require("./getSanitizedUser");
const config = require("../../config/app-config")[process.env.NODE_ENV || "development"];

passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async function signupStrategy(username, password, done) {
      /**
       * 1. If no user is found: return done(data, false);
       * 2. If the password is invalid: return done(data, false);
       * 3. For any other errors: return done(error);
       * 4. If the user is found: return done(null, user);
       *
       * The data and errors will be received by the `authenticate` method of passport.
       */
      try {
        const user = await db.User.findOne({
          email: username,
        })
          .exec()
          .catch((error) => {
            console.log(error);
            return done(error);
          });

        if (user) {
          return done(null, false);
        } else {
          /**
           * Pass the username to the passport.authenticate middleware
           * to create the account there
           */
          return done(null, username);
        }
      } catch (error) {
        return done(error);
      }
    },
  ),
);

module.exports = {
  initialize: passport.initialize(),
};