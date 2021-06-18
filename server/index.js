require('dotenv').config();
const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });

const userSchema = new mongoose.Schema({
username: String,
password: String,
chatRooms: []
});
const User = new mongoose.model("User", userSchema);

const app = express();

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

app.listen(process.env.PORT || 3001, function() {
    console.log("Server started on port 3001");
  });