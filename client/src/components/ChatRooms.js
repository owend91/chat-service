import React from 'react'
import './ChatRooms.css'
import Cookies from 'js-cookie'

function ChatRooms(props) {
    function handleRoomClick(event){
        console.log(event.target.innerText)
        props.setCurrentRoom(event.target.innerText);
    }
    function handleLogoutClick(event){
        Cookies.remove('access-token');
        props.setLoggedIn(false)
        props.setUser({})
        props.setCurrentRoom('')
    }
    return (
        <div className='roomColumn'>
            <button className='logoutButton' onClick={handleLogoutClick}>Logout</button>
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
