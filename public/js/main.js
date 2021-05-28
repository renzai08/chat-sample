const chatForm = document.getElementById('chat-form');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const scrollBot = document.getElementById('messageContainer');
// const chatMessages = document.querySelector('.chat-message');

// let privateMessage = "";
// let privateChat = "";
// var private = false;




const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
let privateID="";
let private=false;
let privateName="";
const socket = io();

socket.emit('joinRoom', { username, room });

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputRoomUsers(users);


})

socket.on('message', message => {
    console.log(message);
    outputMessage(message);
   
    // chatMe(message);

    // chatMessages.scrollTop = chatMessages.scrollHeight;


})

// Messages

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;
  
    if(private){
        socket.emit("private", { message: msg, to: privateID,sender:username });
    }else{
        socket.emit('chatMessage', msg);
    }
  
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

})


socket.on("private",(data)=>{
    console.log(data)
    if(data.sender==username){

        $('.private').append(`<small class='type'>${data.sender}&nbsp;<span class='text-info'></span></small> <div class="you">
        <p class="text">${data.message}</p>
      </div>`)
    }else{
         $('.private').append(` <small class='type1'>${data.sender}&nbsp;<span class='text-info'></span></small> <div class="others mt-1">
         <p class="text1">${data.message}</p>
       </div>`)
    }
})

// Output message
function outputMessage(message) {

    var user = message.username;
    if (user == username) {
        $('.chat-message').append(` <small class='type'>${message.username}&nbsp;<span class='text-info'>${message.time}</span></small> <div class="you">
    <p class="text">${message.text}</p>
  </div>`)

    } else {
        $('.chat-message').append(` <small class='type1'>${message.username}&nbsp;<span class='text-info'>${message.time}</span></small> <div class="others mt-1">
    <p class="text1">${message.text}</p>
  </div>`)

    }
    scrollToBottom();


}



function scrollToBottom() {
    scrollBot.scrollTo(0, scrollBot.scrollHeight)
}



//Add Room name

function outputRoomName(room) {
    roomName.innerText = room;
}



function outputRoomUsers(users) {
    $('.userlist').empty()
    users.forEach((user) => {
        if (username == user.username) {
            $('.userlist').append(`<li class="p-2 text-dark mt-2" username="${user.username}" userid="${user.id}" style="border-radius:5rem;width:fit-content;background-color:white;"><small class='text-muted'>You -</small>&nbsp;${user.username}<i class="fa fa-circle ml-2 text-success" aria-hidden="true"></i></li>`);
        } else {
            $('.userlist').append(`<li class="p-2 mt-2 privateUser" username="${user.username}" userid="${user.id}" style="border-radius:5rem;width:fit-content;"><i class="fas fa-user-friends"></i><input type='hidden' id='idOther' value='${user.id}'>&nbsp;<button id='btn-fr' class='btn-fr' style='border:none;background-color:transparent;'>${user.username}</button><i class="fa fa-circle text-sucess" aria-hidden="true"></i></li>`);
        }
        
        
    });   
}

$(document).on('click', ".privateUser", function () { 
   
    private=true; 
    privateID=$(this).attr("userid")
    privateName=$(this).attr("username")
    console.log(privateName); console.log(privateID)
    $('.chat-message').addClass('d-none').removeClass('d-block')
    // $('#msg').hide();
    $('.leave').addClass('d-none').removeClass('d-block')
    $('.private').addClass('d-block').removeClass('d-none')
  $('.message-to').html(`Message to ${privateName}`);
    // $('.private').append(`<p class="mr-3">Message to: <span>${user.username}</span></p><input type="text" placeholder = "Type a Message" class="form-control" id="input-message"
    //     style="margin-top: 400px;"
    // >`)
    
})

$('#room-name').click(function(){
    private=false;
    $('.chat-message').addClass('d-block').removeClass('d-none')
    $('.leave').addClass('d-block').removeClass('d-none')
    $('.private').addClass('d-none').removeClass('d-block')
})




//Someone is typing
var timeout;
var typing = false

function timeoutFunction() {
    typing = false;
    socket.emit("typing", false);
}

$('#msg').keyup(function () {
    typing = true;
    socket.emit('typing', username + ' is typing');
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 1000);
});

socket.on('typing', function (data) {
    if (data) {
        $('#typing').html(data);
    } else {
        $('#typing').html("");
    }

});








