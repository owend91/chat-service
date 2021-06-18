import './App.css';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import Home from './components/Home'
import Login from './components/Login'
import React, {useState, useEffect} from 'react'
import Account from './services/Account'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState({})
  const [currentRoom, setCurrentRoom] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  // console.log('app user: ', user)

  useEffect(() => {
    // console.log('App use effect');
    Account.getUser()
    .then(response => {
      // console.log('User Response: ', response)
      
      if(response.data.user){
        const returnedUser = {
          username: response.data.user.username,
          chatRooms: response.data.user.chatRooms
        }
        setUser(returnedUser)
      }
      setLoggedIn(response.data.loggedIn)
      setIsLoaded(true);
    });

  }, [])

  function homeComponent() {
    return <Home 
      user={user}
      setUser={setUser}
      currentRoom={currentRoom}
      setCurrentRoom={setCurrentRoom}
      setLoggedIn={setLoggedIn}
    />
  }
  function loginComponent() {
    return <Login 
    setLoggedIn={setLoggedIn}
    setUser={setUser}
    />
  }
  return (
    <div className="App">
      {isLoaded ? (
        <Router>
        <Switch>
          <Route 
            path='/' 
            exact 
            component={loggedIn? homeComponent : loginComponent}
          />
          {/* <Route 
            path='/search' 
            exact 
            component={Search}
          /> */}
          </Switch>
        </Router>

      ) : null}
      
    </div>
  );
}

export default App;
