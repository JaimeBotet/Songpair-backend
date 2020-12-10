const passport = require("passport");

const db = require("../models");

async function get(song, receiver, user) {

  const like = await db.Like.findOne({
    "song.uri": song.uri,
    receiverID: receiver,
    senderID: user
  });

  if (like) return true;
  return false;
}

async function check(req, res, next) {
  const {song, receiver} = req.body

  const like = await get(song, receiver, req.user.spotifyID).catch(next);

  if (like) {
    return res.status(200).send({data: {like: true}, error: null});
  } else {
    return res.status(200).send({data: {like: false}, error: null});
  }
}

async function update(req, res, next) {
  const {song, receiver} = req.body

  const like = await db.Like.findOneAndDelete({
    "song.uri": song.uri,
    receiverID: receiver,
    senderID: req.user.spotifyID
  }).catch(next);

  if (like) {
    return res.status(200).send({data: {like: false}, error: null});
  } else {

    await db.Like.create({
      song: song,
      receiverID: receiver,
      senderID: req.user.spotifyID
    }).catch(next);

    return res.status(200).send({data: {like: true}, error: null});
  }
}

module.exports = {
  get,
  check,
  update,
};