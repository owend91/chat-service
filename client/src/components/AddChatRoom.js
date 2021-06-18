import React, {useState} from 'react'
import './AddChatRoom.css'
import Account from '../services/Account'

function AddChatRoom(props) {
    const [roomName, setRoomName] = useState('')
    const [message, setMessage] = useState('')
    const [success, setSuccess] = useState(false)

    function handleRoomNameUpdate(event) {
        setRoomName(event.target.value)
    }
    function handleJoinRoom(event) {
        setMessage('');
        const data = {
            username: props.user.username,
            room: roomName
        }
        if(props.user.chatRooms.includes(roomName)){
            setSuccess(false);
            setMessage('Already a member of that room.')
            setRoomName('')

        } else {
            console.log('join room')
            Account.joinRoom(data)
            .then( response => {
                console.log(response)
                props.setUser(response.data.user)
                props.setCurrentRoom(roomName)

                // setSuccess(true);
                // setMessage(`You joined the room`)
                // setRoomName('')
            })

        }
        
    }
    return (
        <div className='addChatRoom'>
            <div className='header'>
                <h1>Enter a Room Name</h1>
            </div>
            <div className='inputs'>
                <input type='text' placeholder='Room name' onChange={handleRoomNameUpdate} value={roomName}/>
                <button onClick={handleJoinRoom}>Join Room</button>
            </div>
            {message !== '' && <p className={success ? 'successMessage' : 'failMessage'}>{message}</p>}
            
        </div>
    )
}

export default AddChatRoom
