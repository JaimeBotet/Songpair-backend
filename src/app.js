require("dotenv").config();

const app = require("./server");
const socketio = require("socket.io");


const config = require("./config/app-config")[process.env.NODE_ENV || "development"];
const connect = require("./db/connect");
const io = socketio(app);
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8080;



//SOCKET IO HANDLERS
io.on('connect', (socket) => {
  socket.on('join', ({ user, room }, callback) => {

    //it will be announced when each participant "joins the room"
    socket.join(room);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${room}.`});
    socket.broadcast.to(room).emit('message', { user: 'admin', text: `${user.name} has joined!` });


    callback();
  });

  socket.on('sendMessage', ({user, room, message}, callback) => {
    io.to(room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', ({ name, room }) => {
    //it will be announced when each participant "leaves the room"
    io.to(room).emit('message', { user: 'Admin', text: `${name} has left.` });
  })
});



connect()
  .then(async () => {
    app.listen(port, host, () => {
        console.log(`Server listening on http://localhost:${config.app.port}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });