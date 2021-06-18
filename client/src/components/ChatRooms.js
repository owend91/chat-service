import React from 'react'
import './ChatRooms.css'

function ChatRooms(props) {
    function handleRoomClick(event){
        console.log(event.target.innerText)
        props.setCurrentRoom(event.target.innerText);
    }
    return (
        <div className='roomColumn'>
            <hr/>
            <button onClick={handleRoomClick}>Add new room</button>
            {props.user.chatRooms.map((val, key) => {
                return (
                    <div key={key}>
                        <hr/>
                        <button onClick={handleRoomClick}>{val}</button>
                    </div>
                )
            })}
            
        </div>
    )
}

export default ChatRooms
