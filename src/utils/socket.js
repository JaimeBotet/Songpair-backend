const config = require('../config/app-config')[process.env.NODE_ENV || "development"];
const socketio = require("socket.io");

const socketCon = (server) => {
    console.log("Entered socketCon");
    const io = socketio(server, {
        cors: {
            origin: config.app.clientDomain,
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        socket.on('join', ({ user, room }, callback) => {
            console.log("Made Socket connection in room " + room);
            //it will be announced when each participant "joins the room"
            socket.join(room);
            //here we send the room number/id to the other user
        
            socket.broadcast.to(room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
        
            callback();
        });
    
        //When a user in the frontend "sends" a message, we broadcast it back to all the users in the room
        socket.on('sendMessage', ({user, room, message}, callback) => {
            io.to(room).emit('message', { user: user.name, text: message });
            callback();
        });
    
        //it will be announced when each participant "leaves the room"
        socket.on('leaveChat', ({ user, room }) => {
        io.to(room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
        })
    });
}

module.exports = socketCon;