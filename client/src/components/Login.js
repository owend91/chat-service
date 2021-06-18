import React, {useState} from 'react'
import './Login.css'
import {Link} from 'react-router-dom';
import Account from '../services/Account'

function Login(props) {
    const [isRegistering, setIsRegistering] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [userExists, setUserExists] = useState(false)

    function handleFormSwitch() {
        setIsRegistering(!isRegistering);
        setConfirmPassword('')
    }

    function handleUsernameChange(event){
        setUsername(event.target.value);
    }

    function handlePasswordChange(event){
        setPassword(event.target.value);
    }

    function handleConfirmPasswordChange(event){
        setConfirmPassword(event.target.value);
    }

    function handleRegisterClick(){
        setUserExists(false)
        if(password !== confirmPassword){
            alert("Passwords must match")
        } else {
            const body = {
                username: username,
                password: password
            }
            Account.register(body)
                .then( (response) =>{
                    console.log(response)
                    if(response.status === 200){
                        setUserExists(true);
                    } else {
                        props.setUser(response.data.user)
                        props.setLoggedIn(true);

                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    function handleLoginClick(){
        const body = {
            username: username,
            password: password
        }
        console.log('body: ', body)
        Account.login(body)
        .then( (response) =>{
            console.log('login response: ', response.data.user)
            props.setUser(response.data.user)
            props.setLoggedIn(true);


        });
    }
    
    return (
        <div className='loginWindow'>
            <div className="header">
                <h1>{isRegistering ? "Register" : "Login"}</h1>
            </div>
            <div className="body">
                <div className='message'>
                    {userExists && <p className='errorMessage'>Username already exists</p>}
                </div>
                <div className="inputs">
                    <input type='text' placeholder='username' onChange={handleUsernameChange} value={username}/>
                    <input type='password' placeholder='password' onChange={handlePasswordChange} value={password}/>
                    {isRegistering && <input type='password' placeholder='confirm password' onChange={handleConfirmPasswordChange} value={confirmPassword}/>}
                    {isRegistering ? (
                        <button onClick={handleRegisterClick}> Register </button>
                    ) : (
                        <button onClick={handleLoginClick}> Login </button>
                    )}
                </div>
            </div>
            <div className="footer">
                <div className="switchForm">
                    <button onClick={handleFormSwitch}> {!isRegistering ? "Register" : "Login"} </button>
                </div>
            </div>
        </div>
    )
}

export default Login
