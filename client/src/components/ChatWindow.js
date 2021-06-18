import React, {useState} from 'react'
import './ChatWindow.css'

function ChatWindow(props) {
    const [message, setMessage] = useState('')
    return (
        <div className='chatPane'>
            <div className='header'>
                <h1>{props.currentRoom}</h1>
            </div>
            <div className='body'>

            </div>
            <div className='footer'>
                <input type='text' placeholder='message' />
                <button> Send </button>
            </div>
        </div>
    )
}

export default ChatWindow
