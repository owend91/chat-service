require('dotenv').config();
const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const socket = require('socket.io')
const chatRooms={}


mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });

const userSchema = new mongoose.Schema({
username: String,
password: String,
chatRooms: []
});

const roomSchema = new mongoose.Schema({
    roomName: String,
    chats: [{}]
  });
  const ChatRoom = new mongoose.model("ChatRoom", roomSchema);
const User = new mongoose.model("User", userSchema);

const app = express();
const frontEndOrigin= "http://localhost:3000"

const expressPort = process.env.EXPRESS_PORT || 3001;
// const socketPort = process.env.SOCKET_PORT || 3001;



app.use(cors())
app.use(express.json())



app.route('/login')
.post((req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({username: username}, (err, foundUser) => {
        console.log(foundUser)
        if(!err){
            const returnedUser = {
                username: foundUser.username,
                chatRooms: foundUser.chatRooms
            }
            console.log('returned user: ', returnedUser)
            res.status(200).send({'success': 'logged in', 'user': returnedUser});
        }
    })  
});

app.route('/joinroom')
.post((req,res) => {
    const username = req.body.username;
    const room = req.body.room;
    User.updateOne({username: username}, { $push: { chatRooms: room } }, (err) => {
        // console.log(updatedUser)
        if(!err){
            User.findOne({username: username}, (err, updatedUser) => {
                const returnedUser = {
                    username: updatedUser.username,
                    chatRooms: updatedUser.chatRooms
                }
                res.status(200).send({'success': 'updated', 'user': updatedUser});
            })
        }
    })  
});

app.route('/register')
.post((req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({username: username}, (err, foundUser) => {
        if(err) {
            res.status(404).send({'error': 'Error seeing if user exists'})
        }
        if(foundUser){
            console.log('user exists')
            res.status(200).send({'error': 'User exists'})
        } else {
            console.log('user does not exist')

            const newUser = new User(
                {
                    username: username,
                    password: password,
                    chatRooms: []
                }
            )
            newUser.save(err => {
                if(!err){
                    console.log('user saved')
                    const returnedUser = {
                        username: username,
                        chatRooms: []
                    }
                    res.status(201).send({'success' : 'user saved!', 'user': returnedUser})
                } else {
                    res.status(404).send({'error': 'error saving new user'})
                }
            })
        }
    });
});

const server = app.listen(expressPort, () => {
    console.log(`Server running on port ${expressPort}`)
})

// server = require('http').createServer(app)

io = socket(server, {
    cors: {
      origin: frontEndOrigin
    }
  });

io.on('connection', socket => {
    console.log('connected: ', socket.id)

    socket.on('join_room', (data) => {
        socket.join(data)
        console.log(socket.id + " now in rooms ", socket.rooms);
        ChatRoom.findOne({roomName: data}, (err, chats) => {
            if(err){
                console.log('error: ', err);
            } else {
                console.log('chats: ', chats);
                if(chats){
                    chatRooms[data] = chats;
                } else {
                    chatRooms[data] = new ChatRoom ({
                        roomName: data
                    });
                }
                
                io.to(data).emit("populate_chats", chatRooms[data].chats)
                console.log(socket.id + " now in rooms ", socket.rooms);

            
                console.log('chatroom data: ', chatRooms[data].chats);
            }
        })
    });

    socket.on('send_message',(data) => {
        console.log(data)
        chatRooms[data.room].chats.push(data.content);
        chatRooms[data.room].save( err => {
            if(!err){
                socket.to(data.room).emit("populate_chats", chatRooms[data.room].chats);
            }
        }) 
    });


    socket.on('disconnect', () => {
        console.log('User Disconnected')
    })
})

// app.listen(expressPort, function() {
//     console.log("Server started on port 3001");
//   });