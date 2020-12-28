const db = require("../models");

async function updateSocket(token, socketID) {
    const user = await db.User.findOne({ token: token });

    const socket = await db.Socket.findOneAndUpdate({ userID: user._id }, {socket: socketID});

    if (!socket) {
        await db.Socket.create({
            userID: user._id,
            socket: socketID,
        })
    }
}

async function getSocket(receiver) {
    const user = await db.User.findOne({ spotifyID: receiver });

    const dbSocket = await db.Socket.findOne({ userID: user._id });

    if (dbSocket) return dbSocket.socket;
    return null
}


module.exports = {
    updateSocket,
    getSocket,
};
