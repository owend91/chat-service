import React, {useState} from 'react'
import './Home.css'
import ChatRooms from './ChatRooms'
import AddChatRoom from './AddChatRoom'
import ChatWindow from './ChatWindow'

function Home(props) {
    console.log('home: ', props.user)
    // const [currentRoom, setCurrentRoom] = useState('')

    return (
        <div className='fullHome'>
            <div className='chatRoomList'>
                <ChatRooms 
                    currentRoom={props.currentRoom}
                    setCurrentRoom={props.setCurrentRoom}
                    user={props.user}
                />
            </div>
            <div className='chatWindow'>
                {props.currentRoom === 'Add new room' ? (
                    <AddChatRoom 
                        user={props.user}
                        setUser={props.setUser}
                        setCurrentRoom={props.setCurrentRoom}
                    />
                ) : (
                    <ChatWindow 
                        currentRoom={props.currentRoom}
                        user={props.user}
                    />
                )}
            </div>
        </div>
    )
}

export default Home
