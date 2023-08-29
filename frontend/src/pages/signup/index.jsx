import React, { useState } from 'react';
import './style.css'
import { isValidEmail, isValidPassword, isValidPhoneNumber } from '../../utility/validation'

export default function Signup () {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [agreement, setAgreement] = useState(false);

  function handleSignup(e) {
    e.preventDefault();


    var error_message = false; 
    if (!isValidEmail(email)){
        const error = document.getElementById("email-error"); 
        error.textContent = "Invalid email"; 
        error_message = true; 
    }
    else{
      const error = document.getElementById("email-error"); 
      error.textContent = ""; 
    }

    if (!agreement) {
      const error = document.getElementById("agree-error"); 
      error.textContent = "Please agree to terms and conditions before proceeding."
      error_message = true; 
    }
    else{
      const error = document.getElementById("agree-error"); 
      error.textContent = ""
    }
    

    if (!isValidPassword(password)){
      const error = document.getElementById("pass-error"); 
      error.textContent = "Password must be 8 characters long and contain at least 1 upper case, 1 lower case, 1 number and 1 symbol."
      error_message = true; 
    }else{
      const error = document.getElementById("pass-error"); 
        error.textContent = ""
    }

    if (password !== confirmPassword) {
      const error = document.getElementById("pass2-error"); 
      error.textContent = "Passwords don't match."
      error_message = true; 
    }
    else{
      const error = document.getElementById("pass2-error"); 
      error.textContent = ""; 
    }


    if (!isValidPhoneNumber(phoneNumber)){
        const error = document.getElementById("phone-error"); 
        error.textContent = "Invalid phone number."; 
        error_message = true; 
    }
    else{
      const error = document.getElementById("phone-error"); 
      error.textContent = "";
    }

    if (!username){
        const error = document.getElementById("username-error"); 
        error.textContent = "Please enter a username."
        error_message = true;  
    }
    else{
      const error = document.getElementById("username-error"); 
      error.textContent = ""
    }

    if (error_message){
        return; 
    }

  
    fetch("http://localhost:8000/accounts/signup/", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
        confirm_password: confirmPassword, 
        first_name: firstName, 
        last_name: lastName, 
        phone: phoneNumber, 
        email: email
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/login";
        } else {
          const error = document.getElementById("signup-error"); 
          error.textContent = "Username in use. Please select a different username."
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Username in use.");
      });
  }

  return (
    <div className="d-flex justify-content-center body-end" style={{ paddingTop: 20 }}>
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label htmlFor="first-input">First Name: </label>
          <input type="text" className="form-control" id="first-input" placeholder="Jane" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="last-input">Last Name: </label>
          <input type="text" className="form-control" id="last-input" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="email-input">Email address: </label>
          <input type="email" className="form-control" id="email-input" placeholder="jane.doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <p className="error" id="email-error"></p>
        </div>
        <div className="form-group">
          <label htmlFor="number-input">Phone Number: </label>
          <input type="tel" className="form-control" id="number-input" placeholder="000-000-0000" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          <p className="error" id="phone-error"></p>
        </div>
        <div className="form-group">
          <label htmlFor="username-input">Username: </label>
          <input type="text" className="form-control" id="username-input" placeholder="janedoe" value={username} onChange={(e) => setUsername(e.target.value)} />
          <p className="error" id="username-error"></p>
        </div>
        <div className="form-group">
          <label htmlFor="pass-input">Create Password: </label>
          <input type="password" className="form-control" id="pass-input" placeholder="*******" value={password} onChange={(e) => setPassword(e.target.value)} />
          <small className="form-text text-muted">Password must be at least 8 characters long.</small>
          <p className="error" id="pass-error"></p>

        </div>
        <div className="form-group">
          <label htmlFor="conf-pass-input">Confirm Password: </label>
          <input type="password" className="form-control" id="conf-pass-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <p className="error" id="pass2-error"></p>
        </div>
        <div className="form-group">
          <input type="checkbox" className="d-inline-block" id="agreement" checked={agreement} onChange={(e) => setAgreement(e.target.checked)} />
          <label htmlFor="agreement">I agree to the terms and conditions of Restify. </label>
          <p className="error" id="agree-error"></p>
        </div>
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary border-0 green-btn" onClick={handleSignup}>Sign Up</button>
        </div>
        <p className="error text-center" id="signup-error"></p>
      </form>
    </div>
  );
};

