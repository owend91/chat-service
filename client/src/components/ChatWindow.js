import React, {useState, useEffect, useRef} from 'react'
import './ChatWindow.css'
import io from 'socket.io-client'
import dotenv from 'dotenv';

dotenv.config();

let socket;
const CONNECTION_PORT=process.env.REACT_APP_API_BASE

function ChatWindow(props) {

    const [message, setMessage] = useState('')
    const [messageList, setMessageList] = useState([])
    let messageBottom = useRef();

    useEffect(() => {
        // console.log('connecting...')
        socket = io(CONNECTION_PORT)
        socket.emit('join_room', props.currentRoom);

      }, [CONNECTION_PORT])
    
    useEffect( () => {
    socket.on("populate_chats", data => {
        // console.log('room data: ', data);
        setMessageList(data)
        if(messageBottom.current){
            messageBottom.current.scrollIntoView({ behavior: 'auto' });
        }
        // console.log('messages: ', messageList)

    })
    }, [])

    const sendMessage = async () => {
        const msg = {
          room: props.currentRoom,
          content: {
            author: props.user.username,
            message: message
          }
        }
        setMessage('')
        await socket.emit('send_message', msg);
        setMessageList([...messageList, msg.content])
        if(messageBottom.current){
            messageBottom.current.scrollIntoView({ behavior: 'auto' });
        }
    }

    function handleUpdateMessage(event) {
        setMessage(event.target.value)
    }

    return (
        <div className='chatPane'>
            <div className='header'>
                <h1>{props.currentRoom}</h1>
            </div>
            <div className='body'>
                <div className='messages'>
                    {
                        messageList.map((val, key) => {
                            {/* console.log('val: ', val) */}
                            return (
                                <div className='messageContainer' id={val.author === props.user.username ? "You" : "Other"}>
                                    <h3>{val.author} </h3>
                                    
                                    <div className='messageBox'>
                                        <p>{val.message}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className="messageEnd" ref={messageBottom}></div>
                </div>
            </div>
            <div className='footer'>
                <input type='text' placeholder='message' onChange={handleUpdateMessage} value={message}/>
                <button onClick={sendMessage}> Send </button>
            </div>
        </div>
    )
}

export default ChatWindow
