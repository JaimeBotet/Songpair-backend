const passport = require("passport");

const db = require("../models");
const getSanitizedUser = require("../utils/auth/getSanitizedUser");
const getSanitizedProfile = require("../utils/auth/getSanitizedProfile");
const { generateToken, getSong } = require('../utils/RequestsAPI');
const likeController = require("./like-controller");



async function getChats(req, res, next) {
    const user = await db.User.findOne({ spotifyID: req.params.id }).catch(next);

    if (!user) return res.status(404).send({data: null, error: "User not found"});
    let chats = []

    return res.status(200).send({data: chats, error: null});
}

async function openRoom(req, res, next) {

    const {
        user,
        participant,
    } = req.body;
    
    //Information sent from the frontend:
    //user -> token
    //participant -> spotifyID
    const creatorID = await db.User.findOne({ token: user }).catch(next)._id;
    const participantID =  await db.User.findOne({ spotifyID: participant }).catch(next)._id;

    //We check if there is a chat room opened already, created either by the user or the other participant
    const room = await db.Room.findOne({ $or:[{creatorID:creatorID , participantID:participantID}, {creatorID:participantID , participantID:creatorID} ]}).catch(next);
    
    if(room) return res.status(200).send({data: room._id, error: null});

    const newRoom = await db.Room.create({
        creatorID: creatorID,
        participantID: participantID,
    }).catch((error) => {
        return next(error);
    });

    await newRoom.save().catch(next);

    return res.status(200).send({data: newRoom._id, error: null});
}

module.exports = {
    getChats,
    openRoom
};