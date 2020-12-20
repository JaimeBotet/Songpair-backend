const config = require('../config/app-config')[process.env.NODE_ENV || "development"];
const socketio = require("socket.io");

const socketCon = (server) => {
    const io = socketio(server, {
        cors: {
            origin: config.app.clientDomain,
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        socket.on('join', ({ user, room }, callback) => {
            socket.join(room);
            //it will be announced to the room when a participant "joins the room"
            socket.broadcast.to(room).emit('message', { user: 'Server', text: `${user.name} has joined!` });
            callback();
        });
    
        //When a user in the frontend "sends" a message, we broadcast it back to the room
        socket.on('sendMessage', ({user, room, message}, callback) => {
            io.to(room).emit('message', { user: user.name, text: message });
            callback();
        });
    
        //it will be announced when each participant "leaves the room"
        socket.on('leaveChat', ({ user, room }) => {
        io.to(room).emit('message', { user: 'Server', text: `${user.name} has left.` });
        })
    });
}

module.exports = socketCon;