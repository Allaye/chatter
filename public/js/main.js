const chatform = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and roomname from url string

const {username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const socket = io();
// join chatroom

socket.emit('joinroom', { username, room });

//get room and users 

socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});



// message from server
socket.on('message', message =>{
    //console.log(message);
    outputMessage(message);

    // Scroll down
    
    chatMessages.scrollTop = chatMessages.scrollHeight;

    
}); 

// message submit

chatform.addEventListener('submit', (e) =>{
    e.preventDefault();
    const msg = e.target.elements.msg.value;

    //emit chat message
    socket.emit('chatmessage', msg);

    // clear input box
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// output message to document
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// add room name to dom
function outputRoomName(room){
    roomName.innerText = room;
}

// add user to dom
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}`;
}
