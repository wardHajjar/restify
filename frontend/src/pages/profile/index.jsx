import React, { useState, useEffect } from 'react';
import { isValidEmail, isValidPassword, isValidPhoneNumber} from '../../utility/validation'

export default function Profile() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState(''); 
    const [confirmPassword, setConfPassword] = useState(''); 
    const [profilePic, setProfilePic] = useState(''); 


    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:8000/accounts/user/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response.json())
        .then((data) => {
            setFirstName(data.first_name);
            setLastName(data.last_name);
            setEmail(data.email);
            setPhoneNumber(data.phone);
        })
        .catch((error) => {
            console.log("Error fetching user data: ", error);
        });
    }, []);

    
    const handleSubmit = (event) => {
        event.preventDefault();

        var error_message = false; 
        if (email && !isValidEmail(email)){
            const error = document.getElementById("email-error"); 
            error.textContent = "Invalid email"; 
            error_message = true; 
        }
        else{
            const error = document.getElementById("email-error"); 
            error.textContent = ""; 
        }


        if (password && !isValidPassword(password)){
            const error = document.getElementById("pass-error"); 
            error.textContent = "Password must be 8 characters long and contain at least 1 upper case, 1 lower case, 1 number and 1 symbol."
            error_message = true; 
        }
        else{
            const error = document.getElementById("pass-error"); 
            error.textContent = ""  
        }

        if (password && password !== confirmPassword) {
            const error = document.getElementById("pass2-error"); 
            error.textContent = "Passwords don't match."
            error_message = true; 
        }
        else{
            const error = document.getElementById("pass2-error"); 
            error.textContent = ""
        }
  
        if (phoneNumber && !isValidPhoneNumber(phoneNumber)){
            const error = document.getElementById("phone-error"); 
            error.textContent = "Invalid phone number."
            error_message = true; 
        }
        else{
            const error = document.getElementById("phone-error"); 
            error.textContent = ""
        }

        if (error_message){
            return; 
        }


        const token = localStorage.getItem('token');
        var body = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phoneNumber, 
        };

        if (password) {
            body.password = password;
        }
        
        body = JSON.stringify(body); 


        fetch('http://localhost:8000/accounts/edit/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body,
        })
        .then((response) => response.json())
        .then((data) => {
            const success = document.getElementById("save-success"); 
            success.textContent = "Changes have been saved."
        })
        .catch((error) => {
            // Handle error
            const success = document.getElementById("save-success"); 
            success.textContent = ""
        });
    };

    const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
    };
    reader.readAsDataURL(file);
  };
    
    return (
    <>
      <div className="d-flex justify-content-center body-end">   
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="d-flex justify-content-center" style={{paddingTop: '20px'}}>
                <img id="photo" className="rounded-circle" alt="No Profile Picture" src={profilePic}/>
            </div>
            <div className="d-flex justify-content-center" style={{paddingTop: '20px'}}>
                <input type="file" id="profile-pic-input" accept="image/*" name="profile_pic" onChange={handleProfilePicChange}/>
            </div>
          <div className="form-group">
            <label htmlFor="first-input">First Name: </label>
            <input type="text" className="form-control" id="first-input" value={firstName || ''} onChange={e => setFirstName(e.target.value)}/>
          </div>
          <div className="form-group">
            <label htmlFor="last-input">Last Name: </label>
            <input type="text" className="form-control" id="last-input" value={lastName || ''} onChange={e => setLastName(e.target.value)}/>
          </div>
          <div className="form-group">
            <label htmlFor="email-input">Email address: </label>
            <input type="email" className="form-control" id="email-input" value={email || ''} onChange={e => setEmail(e.target.value)} />
            <p className = "error" id="email-error"></p>
          </div>
          <div className="form-group">
            <label htmlFor="number-input">Phone Number: </label>
            <input type="tel" className="form-control" id="number-input" value={phoneNumber || ''} onChange={e => setPhoneNumber(e.target.value)}/>
            <p className="error" id="phone-error"></p>
          </div>
          <div className="form-group">
            <label htmlFor="pass-input">Password: </label>
            <input type="passowrd" className="form-control" id="pass-input" placeholder="*****" onChange={e => setPassword(e.target.value)}/>
            <p className="error" id="pass-error"></p>
          </div>
          <div className="form-group">
            <label htmlFor="pass2-input">Confirm password: </label>
            <input type="passowrd" className="form-control" id="pass2-input" placeholder="*****" onChange={e => setConfPassword(e.target.value)}/>
            <p className="error" id="pass2-error"></p>
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary green-btn border-0">Save</button>
            
          </div>
          <p className="success text-center d-block" id="save-success"></p>
          
        </form>
      </div>
    </>
)}; 