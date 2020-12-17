const passport = require("passport");

const db = require("../models");
const getSanitizedUser = require("../utils/auth/getSanitizedUser");
const getSanitizedProfile = require("../utils/auth/getSanitizedProfile");
const { generateToken, getSong } = require('../utils/RequestsAPI');
const likeController = require("../controllers/like-controller");

async function signUp(req, res, next) {
  passport.authenticate("signup", async (error, user, info) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return res.status(400).send({
        data: null,
        error: "User already signed up",
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

async function logout(req,res,next){
  if (req.user) {
    const user = req.user;

    const dbUser = await db.User.findOne({ token: user.token }).catch(next);
    dbUser.token = null;
    await dbUser.save().catch(next);

    req.logout();

    return res.status(200).send({
      data: "Ok",
      error: null,
    });
  } else {
    res.status(401).send({
      data: null,
      error: "Unauthorized",
    });
  }
};

async function login(req, res, next) {
  passport.authenticate("login", async (error, user, info) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return res.status(400).send({
        data: null,
        error: "Wrong email or password",
      });
    }

    req.login(user, { session: false }, async (error) => {
      if (error) return next(error);

      try {
        const token = await generateToken(user.refreshToken, next);

        if (token.error) return next(error);

        await db.User.findByIdAndUpdate(user._id, { token: token.data.access_token }).catch(next);

        // Send back the token to the user
        return res.status(200).send({
          data: {
            user: user,
            token: token.data.access_token,
          },
          error: null,
        });
      } catch (error) {
        return next(error);
      }
    });
  })(req, res, next);
}

async function nearPeople(req, res, next) {
  const nearUsers = [];
  const { point } = req.body;

  await updateUserLocation(req, res, next);

  const users = await db.User.find({
    location:
      { $near:
         {
           $geometry: { type: "Point",  coordinates: [ point.long, point.lat ] },
           $maxDistance: 20000
         }
      },
      token: {$ne:null}
  });

  if (!users) return res.status(404).send({data: null, error: "No near users"});

  for (let user of users) {
    const token = await generateToken(user.refreshToken);

    if (!token.error) {
      const userSong = await getSong(token.data.access_token);

      if (userSong.data) {
        nearUsers.push({
          name: user.name,
          avatar: user.avatar,
          spotifyID: user.spotifyID,
          location: user.location,
          currentSong: userSong.data,
          like: await likeController.get(userSong.data, user.spotifyID, req.user.spotifyID)
        });
      }
    } else {
      if (token.error.status === 503) return res.status(503).send({data: null, error: "Service unavailable"});
    }
  }

  if (nearUsers.length === 0) return res.status(404).send({data: null, error: "No near users"});

  return res.status(200).send({data: nearUsers, error: null});
}

async function updateUserLocation(req, res, next) {
  const dbUser = await db.User.findOne({ token: req.user.token }).catch(next);
  dbUser.location = {type: "Point", coordinates: [req.body.point.long, req.body.point.lat]};
  await dbUser.save().catch(next);
}

async function getProfile(req, res, next) {
  const user = await db.User.findOne({ spotifyID: req.params.id }).catch(next);

  if (!user) return res.status(404).send({data: null, error: "User not found"});

  // Getting current song with a refresh token
  const token = await generateToken(user.refreshToken).catch(next);
  const currentSong = await getSong(token.data.access_token).catch(next);

  // Create a profile object
  let profile = getSanitizedProfile(user.toObject());

  // Verify if user is playing a song
  profile.currentSong = currentSong.data ? currentSong.data : null
  // If is playing a song get actual user like to this song and total likes
  if (profile.currentSong) {
    profile.currentSong.totalLikes = await likeController.getMusicLikes(user.spotifyID, currentSong.data.uri).catch(next);
    profile.currentSong.like = await likeController.get(currentSong.data, user.spotifyID, req.user.spotifyID).catch(next);
  }
  // Gets likes numbers from this user's profile
  profile.likes = await likeController.getProfileLikes(user.spotifyID).catch(next);

  return res.status(200).send({data: profile, error: null});
}

async function getChats(req, res, next) {
  const user = await db.User.findOne({ spotifyID: req.params.id }).catch(next);

  if (!user) return res.status(404).send({data: null, error: "User not found"});

  const token = await generateToken(user.refreshToken);
  const currentSong = await getSong(token.data.access_token);

  let profile = getSanitizedProfile(user.toObject());
  profile.currentSong = currentSong.data ? currentSong.data : null;
  if (profile.currentSong) profile.currentSong.like = await likeController.get(currentSong.data, user.spotifyID, req.user.spotifyID)

  return res.status(200).send({data: profile, error: null});
}

module.exports = {
  signUp,
  login,
  nearPeople,
  logout,
  updateUserLocation,
  getProfile,
  getChats,
};