const users = [];

// add users to tje list of users
function userjoin(id, username, room){
    const user = {id, username, room};
    users.push(user);
    return user;
}

// get current user
function getCurrentUser(id){
    return  users.find(user => user.id === id);
}

// user leaves the chat
function userLeaves(id){
    const index = users.findIndex(user => user.id === id);

    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

// get room userLeaves
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userjoin, 
    getCurrentUser,
    userLeaves,
    getRoomUsers};