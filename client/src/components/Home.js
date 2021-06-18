import React, {useState, useEffect} from 'react'
import './Home.css'
import ChatRooms from './ChatRooms'
import AddChatRoom from './AddChatRoom'
import ChatWindow from './ChatWindow'
import Account from '../services/Account'

function Home(props) {
    console.log('home: ', props.user)
    // const [currentRoom, setCurrentRoom] = useState('')
    useEffect(() => {
        // console.log('I am home')
        Account.getRooms();
    }, [])

    return (
        <div className='fullHome'>
            <div className='chatRoomList'>
                <ChatRooms 
                    currentRoom={props.currentRoom}
                    setCurrentRoom={props.setCurrentRoom}
                    user={props.user}
                    setLoggedIn={props.setLoggedIn}
                    setUser={props.setUser}
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
