const socket=io();

var username;

var chats=document.querySelector(".chats");
var users_list=document.querySelector(".users-list");
var users_count=document.getElementsByClassName("users-count")[0];
var msg_send=document.querySelector("#user-send");
var user_msg=document.querySelector("#user-msg")

do{
    username=prompt("Enter your name: ");
}while(!username);

/*It will be called when user will join */
socket.emit("new-user-joined",username);

/*Notifying that user is joined */
socket.on('user-connected',(socket_name)=>{
    userJoinLeft(socket_name,'joined');
});

/*function to create joined/left status div */
function userJoinLeft(name,status){
    let div=document.createElement("div");
    div.classList.add('user-join');
    let content=name+" - "+status;
    div.innerHTML=content;
    chats.appendChild(div);
    chats.scrollTop=chats.scrollHeight;
}

socket.on('user-disconnected',(user)=>{
    console.log(user,"bhaag gya")
    userJoinLeft(user,'left');
}); 




msg_send.addEventListener('click',()=>{
    const data={
        user: username,
        msg: user_msg.value
    };
    if(user_msg.value!=''){
        appendMessage(data,'outgoing');
        socket.emit('message',data);
        user_msg.value='';
    }
});

function appendMessage(data,status){
    let div=document.createElement('div');
    let p=data.user;

    let msg=data.msg;

    div.classList.add('message',status);
    let content=`<h5>${data.user}</h5><p>${data.msg}</p>`;
    div.innerHTML= content;
    chats.appendChild(div);
    chats.scrollTop=chats.scrollHeight;
}

socket.on('message',(data)=>{
    appendMessage(data,'incoming');
});

function appendListOfUser(userName){

    const userNameDiv = document.createElement("div")
    userNameDiv.innerText = `${userName}`;
    users_list.appendChild(userNameDiv)

}

socket.on("user-list",(usersList)=>{
    
    users_count.innerText = Object.keys(usersList).length
    users_list.innerHTML = "";
    for (const [key, value] of Object.entries(usersList)){
        appendListOfUser(value)
    }
    
})