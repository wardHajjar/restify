import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar  from './components/Navbar/Navbar';
import Login from './pages/login/index'
import Signup from './pages/signup/index';
import Profile from './pages/profile/index'; 
import PropertyList from './pages/propertySearch';
import PropertyDetails from './pages/propertyView';
import PropertyAdd from './pages/propertyAdd';
import Reservation from './pages/reservation';
import Notification from './pages/notifications';

function App() {
  var [loggedIn, setLoggedIn] = useState(false);
  var [newNotif, setNewNotif] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
      console.log("app login" + loggedIn); 
    }
  }, [loggedIn]);

  function handleLogin() {
    setLoggedIn(true);
  }

  function handleLogout() {
    setLoggedIn(false);
    localStorage.removeItem('token');
    window.location.replace('/login');
  }

  useEffect(() => {
    var url = `http://localhost:8000/notifications/unread/`;
    const token = localStorage.getItem('token');

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then((data) => { 
        if (data.results.length !== 0) {
          setNewNotif(true); 
        } else {
          console.log('here'); 
          setNewNotif(false); 
        }
        console.log(data.results.length === 0); 

      })
      .catch(error => console.log(error));
    
  }, [newNotif])
 
  return (
    <Router>
      <div className="App">
        <Navbar loggedIn={loggedIn} handleLogout={handleLogout} newNotif={newNotif}/>
        <Routes>
          <Route path='/' element={<PropertyList loggedIn={loggedIn}/>} /> 
          <Route path='/login' element={<Login handleLogin={handleLogin} />} />  
          <Route path='/signup' element={<Signup />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/search' element={<PropertyList loggedIn={loggedIn}/>} />
          <Route path='/properties/:pk/view' element={<PropertyDetails />} />
          <Route path='/properties' element={<PropertyAdd />} />
          <Route path='/reservations' element={<Reservation />} />
          <Route path='/notifications' element={<Notification />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

