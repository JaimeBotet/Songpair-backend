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

async function getMusicLikes(user, uri) {
  const totalLikes = await  db.Like.countDocuments({receiverID: user, "song.uri": uri});
  return totalLikes;
}

async function getProfileLikes(user) {
  const totalLikes = await  db.Like.countDocuments({receiverID: user});
  let mostLiked = await db.Like.aggregate(
    [
      { $match: { "receiverID": user} },
      {
        $group : {
          _id : "$song",
          "count": { "$sum": 1 },
        }
      },
      {$sort : { count: -1 }}
    ]
  );

  mostLiked = mostLiked.length === 0 ? null : {...mostLiked[0]._id, likesCount: mostLiked[0].count};

  return {total: totalLikes, mostLiked: mostLiked};
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
  getMusicLikes,
  getProfileLikes,
};