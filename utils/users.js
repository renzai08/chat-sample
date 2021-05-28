const users = [];

//Join users to chatroom
function userJoin(id, username, room){
    const user = { id, username, room};

    users.push(user);

    return user;
}

//Get current users

function getCurrentUsers(id){
    return users.find(user => user.id === id);
}

//user leaves the room
function userLeave(id){
    const ndx = users.findIndex(user=> user.id ===id);

    if(ndx !== 1){
        return users.splice(ndx,1)[0];
    }

}
//Get room users

function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUsers,
    userLeave,
    getRoomUsers
};