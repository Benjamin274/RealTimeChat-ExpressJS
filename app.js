const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require('dotenv').config()
const server =  require('./bin/www')

const io =  require('socket.io')(server)
let randomColor = require('randomcolor')
const uuid = require('uuid')

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));

app.use('/', indexRouter);
app.use("/users", usersRouter);




const users = []
const connections = []


io.on('connection',(socket)=>{

    console.log('New user is conected')
    connections.push(socket)
    let color  = randomColor();


    socket.username = 'Anonymous'
    socket.color = color


    // Listen on username change
    socket.on('change_username',(data)=>{
        // creating randome id for username 
        let id  = uuid.v4()
        socket.id = id
        socket.username = data.nickName
        users.push({
            id,
            username: socket.username,
            color: socket.color
        })
        updateUsername()

    })

    const updateUsername = () => {
        io.sockets.emit('get users',users)
    }
        //listen on new_message
        socket.on('new_message',(data) =>{
            // brodcast the new message 
            io.sockets.emit('new_message', {
                message : data.message, 
                username : socket.username,
                color: socket.color
            });

        })

     socket.io('disconnect',(data)=>{
         if(!socket.username)
         return ;
          let user = null;

          for (let index = 0; index < users.length; index++) {
              if(users[index].id === socket.id){
                  user = users[index];
                  break;
              }
          }

          users.splice(user,1)
          updateUsername()
          connections.splice(connections.indexOf(socket),1)
     })   

})




module.exports = app;
