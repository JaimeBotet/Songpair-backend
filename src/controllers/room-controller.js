const db = require("../models");
const getSanitizedProfile = require("../utils/auth/getSanitizedProfile");

async function getChats(req, res, next) {
    const chats = await db.Room.find({
        $or:[
                {creatorID:req.user._id},
                {participantID:req.user._id}
            ]
        }).catch(next);

    if (!chats) return res.status(404).send({data: null, error: "No active chats"});

    let filterChats = [];

    for (chat of chats) {
        let user = chat.creatorID == req.user._id ? await db.User.findOne({_id:chat.participantID}) : await db.User.findOne({_id:chat.creatorID});
        filterChats.push({room: chat._id, user: getSanitizedProfile(user.toObject())})
    }

    return res.status(200).send({data: filterChats, error: null});
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

async function closeRoom(id) {
    const room = await db.Room.findOneAndDelete({"_id": id,})
    console.log(room);
}

module.exports = {
    getChats,
    openRoom,
    closeRoom
};
