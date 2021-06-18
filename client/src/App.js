import './App.css';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import Home from './components/Home'
import Login from './components/Login'
import React, {useState} from 'react'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState({})
  const [currentRoom, setCurrentRoom] = useState('')

  console.log('app user: ', user)

  function homeComponent() {
    return <Home 
      user={user}
      setUser={setUser}
      currentRoom={currentRoom}
      setCurrentRoom={setCurrentRoom}
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
    </div>
  );
}

export default App;
