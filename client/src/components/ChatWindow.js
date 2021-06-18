import React from 'react'
import './ChatWindow.css'

function ChatWindow(props) {
    return (
        <div>
            <h1>{props.currentRoom}</h1>
        </div>
    )
}

export default ChatWindow
