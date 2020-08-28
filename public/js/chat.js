

$(function(){
    $(document).ready(()=>{
        console.log('They don\'t know shit !' )
    })
    let socket = io.connect('http://localhost:5000');


        //buttons and inputs
        let message = $("#message");
        let send_message = $("#send_message");
        let chatroom = $("#chatroom");
        let feedback = $("#feedback");
        let usersList = $("#users-list");
        let nickName = $("#nickname-input");

        // emmit typing 
        message.bind('keypress',(e)=>{
            let keycode = (e.keyCode ? e.keyCode : e.which);
            if(keycode != '13'){
                socket.emit('typing')
            }

        })

        // if send message button clicked
        send_message.click(()=>{
            socket.emit('new_message',{message:message.val()})
        })

            // Or if the enter key is pressed
    message.keypress( (e) => {
        let keycode = (e.keyCode ? e.keyCode : e.which);
        if(keycode == '13'){
            socket.emit('new_message', {message : message.val()})
        }
    })
    socket.on('new_message',(data)=>{
        feedback.html('');
        message.val('');
        
        chatroom.append(`
        <div>
        <div class="box3 sb14">
          <p style='color:${data.color}' class="chat-text user-nickname">${data.username}</p>
          <p class="chat-text" style="color: rgba(0,0,0,0.87)">${data.message}</p>
        </div>
    </div>
        `);
        keepTheChatRoomToTheBottom()

    })

    //Emit a username
    nickName.keypress((e)=>{
            let keycode = (e.keyCode?e.keyCode:e.which)

            if(keycode == '13'){
                socket.emit('change_username',{nickName:nickName.val()})

                socket.emit('get users',data=>{
                    let html = '';
                    for (let i = 0; i < data.length; i++) {
                        html += `<li class="list-item" style="color: ${data[i].color}">${data[i].username}</li>`;                        
                    }
                    usersList.html(html)
                })
            }
    })

})


// function thats keeps the chatbox stick to the bottom
const keepTheChatRoomToTheBottom = () => {
    const chatroom = document.getElementById('chatroom');
    chatroom.scrollTop = chatroom.scrollHeight - chatroom.clientHeight;
}
