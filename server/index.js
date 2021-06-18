require('dotenv').config();
const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const socket = require('socket.io')
const bcrypt = require('bcrypt')
const cookieParser = require("cookie-parser")
const chatRooms={}
const {createToken, validateToken} = require('./JWT')


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
const frontEndOrigin= process.env.FRONT_END_ORIGIN;

const expressPort = process.env.PORT || 3001;
// const socketPort = process.env.SOCKET_PORT || 3001;




app.use(cors({credentials: true, origin: frontEndOrigin}))
app.use(express.json())
app.use(cookieParser())
app.set('trust proxy', 1)

ChatRoom.find({}, (err, foundRooms) => {
    console.log(foundRooms);
    for(room of foundRooms){
        // console.log(room)
        chatRooms[room.roomName] = room
    }
})
// console.log(chatRooms);



app.route('/login')
.post((req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({username: username}, (err, foundUser) => {
        // console.log(foundUser)
        if(!err){
            if(foundUser){
                bcrypt.compare(password, foundUser.password).then( match => {
                    if(match){
                        const returnedUser = {
                            username: foundUser.username,
                            chatRooms: foundUser.chatRooms
                        }
                        const accessToken = createToken({
                            username: foundUser.username,
                            id: foundUser._id
                        });
                        // console.log('login token: ', accessToken)
                        res.cookie('access-token', accessToken, {
                            maxAge: 60*60*24*30*1000
                        })
                        // console.log('returned user: ', returnedUser)
                        res.status(200).send({'success': 'logged in', 'user': returnedUser});
                    } else {
                        res.status(200).send({'unsuccessful': 'Password Incorrect'});
                    }
                });
            } else {
                res.status(200).send({'unsuccessful': 'User Not Found'});
            }
        }
    })  
});

app.route('/joinroom', validateToken)
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

// app.get('/getrooms', validateToken, (req,res) => {
//     console.log('i am in get rooms')
//     const username = req.username;
//     console.log('getrooms: ', username)
//     // const room = req.body.room;
//     // User.updateOne({username: username}, { $push: { chatRooms: room } }, (err) => {
//     //     // console.log(updatedUser)
//     //     if(!err){
//     //         User.findOne({username: username}, (err, updatedUser) => {
//     //             const returnedUser = {
//     //                 username: updatedUser.username,
//     //                 chatRooms: updatedUser.chatRooms
//     //             }
//     //             res.status(200).send({'success': 'updated', 'user': updatedUser});
//     //         })
//     //     }
//     // })  
// });

app.get('/getuser', validateToken, (req,res) => {
    // console.log('i am in get rooms')
    if(req.authenticated){
        const username = req.username;
        // console.log('getrooms: ', username)
    
        User.findOne({username: username}, (err, foundUser) => {
            if(!err){
                const returnedUser = {
                    username: foundUser.username,
                    chatRooms: foundUser.chatRooms
                }
                res.status(200).send({'success': 'updated', 'user': returnedUser, 'loggedIn': true});
            }
        }) 
    } else {
        res.status(200).send({'success': 'not logged in', 'loggedIn': false});
    }
    
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
            // console.log('user exists')
            res.status(200).send({'error': 'User exists'})
        } else {
            // console.log('user does not exist')
            bcrypt.hash(password, 10).then( hash => {
                const newUser = new User(
                    {
                        username: username,
                        password: hash,
                        chatRooms: []
                    }
                )
                newUser.save(err => {
                    if(!err){
                        // console.log('user saved')
                        const returnedUser = {
                            username: username,
                            chatRooms: []
                        }
                        res.status(201).send({'success' : 'user saved!', 'user': returnedUser})
                    } else {
                        res.status(404).send({'error': 'error saving new user'})
                    }
                });
            });
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
    // console.log('connected: ', socket.id)

    socket.on('join_room', (data) => {
        socket.join(data)
        // console.log(socket.id + " now in rooms ", socket.rooms);
        ChatRoom.findOne({roomName: data}, (err, chats) => {
            if(err){
                console.log('error: ', err);
            } else {
                // console.log('chats: ', chats);
                if(chats){
                    chatRooms[data] = chats;
                } else {
                    chatRooms[data] = new ChatRoom ({
                        roomName: data
                    });
                }
                
                io.to(data).emit("populate_chats", chatRooms[data].chats)
                // console.log(socket.id + " now in rooms ", socket.rooms);

            
                // console.log('chatroom data: ', chatRooms[data].chats);
            }
        })
    });

    socket.on('send_message',(data) => {
        const msg = data.content;
        msg['date'] = new Date();
        chatRooms[data.room].chats.push(msg);
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