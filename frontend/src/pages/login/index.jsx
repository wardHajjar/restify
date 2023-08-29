import { useState } from 'react';

function sendLogin(username, password) {
  return fetch('http://localhost:8000/accounts/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(response => {
    if (response.ok) {
      return response.json()
        .then(data => {
          localStorage.setItem('token', data.tokens.access);
          return { success: true };
        });
    } else {
      return { success: false };
    }
  })
  .catch(error => {
    console.error(error);
    return { success: false };
  });
}

export default function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    sendLogin(username, password)
      .then(response => {
        if (response.success) {
          props.handleLogin(); 
          window.location.href = '/search';
        } else {
            var pError = document.getElementById("login-error"); 
            pError.textContent = "Invalid username or password."; 
            
        }
      });
  }

  return (
    <div className="d-flex justify-content-center body-end" style={{ paddingTop: 20 }}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email-input">Username:</label>
          <input type="text" className="form-control" id="user-input" onChange={e => setUsername(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="pass-input">Password:</label>
          <input type="password" className="form-control" id="pass-input" placeholder="********" onChange={e => setPassword(e.target.value)} />
          <p className='error' id='login-error'></p>
        </div>
        <div className="d-flex justify-content-center" style={{ paddingTop: 10 }}>
          <button type="submit" className="btn btn-primary border-0 green-btn" >
            Log In
          </button>
        </div>
      </form>
    </div>
  );
}
