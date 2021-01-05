const config = require('../config/app-config')[process.env.NODE_ENV || "development"];
const socketio = require("socket.io");
const socketController = require("../controllers/socket-controller")

const socketCon = (server) => {
    const io = socketio(server, {
        cors: {
            origin: config.app.clientDomain,
            credentials: true
        }
    });

    io.on('connection', async (socket) => {
        if (socket.handshake.query['token']) await socketController.updateSocket(socket.handshake.query['token'], socket.id);

        socket.on('newChat', async ({ sender, receiver, room }) => {
            const receiverSocket = await socketController.getSocket(receiver);
            io.to(receiverSocket).emit("newMessage", {sender, room})
        });

        socket.on('join', ({ user, room }, callback) => {
            socket.join(room);

            //it will be announced to the room when a participant "joins the room"
            socket.broadcast.to(room).emit('message', { user: 'Server', text: `${user.name} has joined!` });
            callback();
        });

        //When a user in the frontend "sends" a message, we broadcast it back to the room
        socket.on('sendMessage', ({user, room, message}) => {
            socket.to(room).emit('message', { user: user.name, text: message });
        });

        //it will be announced when each participant "leaves the room"
        socket.on('leaveChat', ({ user, room }) => {
            io.to(room).emit('message', { user: 'Server', text: `${user.name} has left.` });
        })
    });
}

module.exports = socketCon;