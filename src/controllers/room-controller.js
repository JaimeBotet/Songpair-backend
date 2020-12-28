const passport = require("passport");
const config = require("../config/app-config")[process.env.NODE_ENV || "development"];
const db = require("../models");

async function getChats(req, res, next) {
    const user = await db.User.findOne({ spotifyID: req.params.id }).catch(next);

    if (!user) return res.status(404).send({data: null, error: "User not found"});
    let chats = []

    return res.status(200).send({data: chats, error: null});
}

async function openRoom(req, res, next) {

    const {
        sender,
        receiver,
    } = req.body;
    
    //Information sent from the frontend:
    //user -> token
    //participant -> spotifyID
    const creator = await db.User.findOne({ token: sender }).catch(next);
    const participant =  await db.User.findOne({ spotifyID: receiver }).catch(next);

    //We check if there is a chat room opened already, created either by the user or the other participant
    const room = await db.Room.findOne({ $or:[{creatorID:creator._id , participantID:participant._id}, {creatorID:participant._id , participantID:creator._id} ]}).catch(next);

    if(room) return res.status(200).send({data: room, error: null});

    const newRoom = await db.Room.create({
        creatorID: creator._id,
        participantID: participant._id,
    }).catch((error) => {
        return next(error);
    });

    return res.status(200).send({data: newRoom, error: null});
}

module.exports = {
    getChats,
    openRoom
};
