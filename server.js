const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userjoin, getCurrentUser, userLeaves, getRoomUsers } = require('./utils/users');

// init modules
const app = express();
const server = http.createServer(app);
const io = socketio(server);


// set static folder directory 
app.use(express.static(path.join(__dirname, 'public')));

let botName = 'chatterbot';
// runs when clients connects 
io.on('connection', socket => {
    socket.on('joinroom', ({username, room}) => {
        const user = userjoin(socket.id, username, room);
        socket.join(user.room);
        // broadcast to current user
        socket.emit('message', formatMessage(botName, 'Welcome to chatter'));

    // broadcast to other users 
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} just join the chat`));
         // send users and room info 
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    
    // listen for emited chatmessage
    socket.on('chatmessage', msg =>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // broadcast to every user in 
    socket.on('disconnect', ()=>{
        const user = userLeaves(socket.id);
        if(user){
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} have left the chat`));

             // send users and room info 
            io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
            });

        }
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));