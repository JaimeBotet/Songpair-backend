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
    
    console.log("Received request to open chat with participant: " + receiver);
    //Information sent from the frontend:
    //user -> token
    //participant -> spotifyID
    const creator = await db.User.findOne({ token: sender }).catch(next);
    const participant =  await db.User.findOne({ spotifyID: receiver }).catch(next);
    console.log(creator._id);
    console.log(participant._id);

    //We check if there is a chat room opened already, created either by the user or the other participant
    const room = await db.Room.findOne({ $or:[{creatorID:creator._id , participantID:participant._id}, {creatorID:participant._id , participantID:creator._id} ]}).catch(next);
    
    // if(room) return res.status(200).send({data: room._id, error: null});
    if(room) return res.redirect(config.app.clientDomain + "/chat/" + room._id, {data: room._id});

    const newRoom = await db.Room.create({
        creatorID: creator._id,
        participantID: participant._id,
    }).catch((error) => {
        return next(error);
    });

    return res.redirect(config.app.clientDomain + "/chat/" + newRoom._id, {data: newRoom._id});
}

module.exports = {
    getChats,
    openRoom
};
