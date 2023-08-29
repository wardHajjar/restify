import React, { useState, useEffect } from 'react';
import Popup from '../../components/Popup/Popup';
import './style.css'; 

export default function PropertyDetails() {
    const [property, setProperty] = useState({}); 
    const [edit, setEdit] = useState(false); 
    const [name, setName] = useState(''); 
    const [address1, setAddress1] = useState(''); 
    const [address2, setAddress2] = useState(''); 
    const [city, setCity] = useState(''); 
    const [country, setCountry] = useState(''); 
    const [postalCode, setPostalCode] = useState(''); 
    const [email, setEmail] = useState(''); 
    const [number, setNumber] = useState(''); 
    const [guests, setGuests] = useState(1); 
    const [beds, setBeds] = useState(1); 
    const [baths, setBaths] = useState(1); 
    const [details, setDetails] = useState(''); 
    const [price, setPrice] = useState(0); 
    const [pool, setPool] = useState(false); 
    const [bbq, setBbq] = useState(false); 
    const [wifi, setWifi] = useState(false); 
    const [jacuzzi, setJacuzzi] = useState(false); 
    const [laundry, setLaundry] = useState(false); 
    const [parking, setParking] = useState(false); 
    const [kitchen, setKitchen] = useState(false); 
    const [pets, setPets] = useState(false); 
    const [heating, setHeating] = useState(false); 
    const [startDate, setStartDate] = useState(); 
    const [endDate, setEndDate] = useState(); 
    const [val, setVal] = useState('');
    const [bookGuests, setBookGuests] = useState(); 

    const handleButtonSelect = (value) => {
        setVal(value); 
    };

    useEffect(() => {
        var refUrl = window.location.href;
        var splitUrl = refUrl.split("/");
      
        var pk = splitUrl[splitUrl.length - 2];
        
        var url = `http://localhost:8000/properties/` + pk + `/view/`; 
      
        fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(response => response.json())
        .then((data) => {
            if (data) {
                setProperty(data); 
                setName(data.name);
                setAddress1(data.address1); 
                setAddress2(data.address2); 
                setCity(data.city); 
                setCountry(data.country); 
                setBaths(data.bathrooms); 
                setBeds(data.bedrooms); 
                setBbq(data.bbq); 
                setPostalCode(data.postal_code); 
                setDetails(data.description); 
                setEmail(data.email); 
                setNumber(data.phone_number); 
                setGuests(data.guests);
                setPrice(data.price); 
                setPool(data.pool);
                setWifi(data.wifi); 
                setHeating(data.heating); 
                setJacuzzi(data.jacuzzi); 
                setLaundry(data.laundry); 
                setParking(data.parking); 
                setKitchen(data.kitchen); 
                setPets(data.pets); 
                
            } 
        })
        .catch((error) => {
            console.error(error);
        });

        const token = localStorage.getItem('token');
        fetch('http://localhost:8000/accounts/user/', {
            method:"GET", 
            headers: {
                "Content-Type": "application/json", 
                Authorization: `Bearer ${token}`,
            }
            
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.pk === property.owner){
                setEdit(true); 
            }  
        }); 
    }, [property.owner]);
      
    

    const handleSubmit = (e) => {
        e.preventDefault(); 
        const token = localStorage.getItem('token');
       
        if (e.target.id === "save"){
            var body = {
                name: name, 
                address1: address1, 
                address2: address2, 
                city: city, 
                country: country, 
                postal_code: postalCode, 
                guests: guests, 
                bathrooms: baths, 
                bedrooms: beds, 
                description: details, 
                pool: pool, 
                bbq: bbq, 
                kitchen: kitchen, 
                laundry: laundry, 
                pets: pets, 
                heating: heating, 
                jacuzzi: jacuzzi, 
                price: price, 
                email: email, 
                phone_number: number, 
                wifi: wifi, 
                parking: parking, 
                owner: property.owner
            }
            body = JSON.stringify(body); 
            const url = `http://localhost:8000/properties/` + property.pk + `/update/`
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body,
            })
            .then((response) => response.json())
            .then((data) => {
                var success = document.getElementById("save-success"); 
                success.textContent = "Changes saved successfully";   
            })
            .catch((error) => {
                var success = document.getElementById("save-success"); 
                success.textContent = "";  
            });
        }
        else{
            var error_message = false; 
            if (!startDate || new Date(Date.parse(startDate)) < new Date()){
                var error = document.getElementById("start-error"); 
                error.textContent = "Please specify the start date of your booking. Ensure the date is either today or a date in the future"; 
                error_message = true; 
            }else{
                var error = document.getElementById("start-error"); 
                error.textContent = ""; 
            }

            if (!endDate || endDate <= startDate){
                var error = document.getElementById("end-error"); 
                error.textContent = "Please specify the end date of your booking. Ensure the end date comes after the start date."; 
                error_message = true; 
            }else{
                var error = document.getElementById("end-error"); 
                error.textContent = ""; 
            }

            if (!bookGuests || bookGuests > property.guests){
                var error = document.getElementById("bookguest-error"); 
                error.textContent = "Please specify the number of guests. Ensure that the property can accomadate this many guests."; 
                error_message = true; 
            }
            else{
                var error = document.getElementById("bookguest-error"); 
                error.textContent = ""; 
            }
            if(error_message){
                return; 
            }
            var body = {
                start_date: startDate, 
                end_date: endDate, 
                guests: bookGuests

            }
            body = JSON.stringify(body); 
            const url = `http://localhost:8000/reservations/property/` + property.pk + `/reserve/`; 
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }, 
                body
            })
            .then((response) => {
                if (response.status === 400){
                    alert("Property is booked at this time. Please select another date range.")
                }else if (response.status === 201){
                    alert("Your booking request has been sent to the host. You'll hear back shortly")
                    window.location.href = '/search';
                }
            })
            
            .catch((error) => {
                console.log(error); 
            });
             
        }
        
    }

    useEffect(() => {
        if (val === 'yes'){
            const url = `http://localhost:8000/properties/` + property.pk + `/delete/`; 
            const token = localStorage.getItem('token');
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((response) => {
                if (response.status === 204) {
                    window.location.href = '/search';
                }
            })
            
            .catch((error) => {
                console.log(error); 
            }); 
        }else{
            return; 
        }
    }, [val]);     
    
    
    return (
        
        <div className="d-flex justify-content-center body-end" style={{ paddingTop: 20 }}>
        <form className="w-75">

            <div className="form-group">
            <label htmlFor="name">Name: </label>
            <input type="text" className="form-control" id="name" readOnly={!edit} disabled={!edit} onChange={e => setName(e.target.value)} value={name || ''} />
            </div>

            <div className="form-group">
            <label htmlFor="address">Address Line 1: </label>
            <input type="text" className="form-control" id="address" readOnly={!edit} disabled={!edit} onChange={e => setAddress1(e.target.value)} value={address1 || ''}/>
            </div>

            <div className="form-group">
            <label htmlFor="address2">Address Line 2: </label>
            <input type="text" className="form-control" id="address2" readOnly={!edit} disabled={!edit} onChange={e => setAddress2(e.target.value)} value={address2 || ''} />
            </div>

            <div className="form-group">
            <label htmlFor="city">City: </label>
            <input type="text" className="form-control" id="city" readOnly={!edit} disabled={!edit} onChange={e => setCity(e.target.value)} value={city || ''} />
            </div>

            <div className="form-group">
            <label htmlFor="country">Country: </label>
            <input type="text" className="form-control" id="country" readOnly={!edit} disabled={!edit} onChange={e => setCountry(e.target.value)} value={country || ''} />
            </div>

            <div className="form-group">
            <label htmlFor="postal-code">Postal Code: </label>
            <input type="text" className="form-control" id="postal-code" readOnly={!edit} disabled={!edit} onChange={e => setPostalCode(e.target.value)} value={postalCode || ''} />
            </div>

            <div className="form-group">
            <label htmlFor="email-input">Contact E-mail: </label>
            <input type="email" className="form-control" id="email-input" readOnly={!edit} disabled={!edit} onChange={e => setEmail(e.target.value)} value={email || ''} />
            </div>

            <div className="form-group">
            <label htmlFor="num-input">Contact number: </label>
            <input type="number" className="form-control" id="num-input" readOnly={!edit} disabled={!edit} onChange={e => setNumber(e.target.value)} value={number || ''} />
            </div>

            <div className="form-group">
            <label htmlFor="guests">Number of guests allowed: </label>
            <input type="number" className="form-control" id="guests" readOnly={!edit} disabled={!edit} onChange={e => setGuests(e.target.value)} value={guests || 1}/>
            </div>

            <div className="form-group">
            <label htmlFor="beds">Number of beds: </label>
            <input type="number" className="form-control" id="beds" readOnly={!edit} disabled={!edit} onChange={e => setBeds(e.target.value)} value={beds || 1} />
            </div>

            <div className="form-group">
            <label htmlFor="baths">Number of baths: </label>
            <input type="number" className="form-control" id="baths" readOnly={!edit} disabled={!edit } onChange={e => setBaths(e.target.value)} value={baths || 1} />
            </div>
            <div className="form-group">
            <label htmlFor="description">Details: </label>
            <textarea className="form-control" id="description" readOnly={!edit} disabled={!edit} onChange={e => setDetails(e.target.value)} value={details || ''}></textarea>
        </div>
        <div className="d-block">
            {!edit ? (<p>Booking Information</p>) : (<p>Pricing Information</p>)}
            <div className="border rounded d-inline-block w-100" id="pricing-container">
                <div className="form-group">
                    <label htmlFor="price">Per night: </label>
                    <input type="number" className="form-control" id="price" readOnly={!edit} disabled={!edit} onChange={e => setPrice(e.target.value)} value={price || 0}/>
                    {!edit ? (
                    <>
                    <label htmlFor='book-guests'>Guests: </label>
                    <input type='number' className='form-control' id='book-guests' onChange={e => setBookGuests(e.target.value)}></input>
                    <p className='error' id='bookguest-error'></p>
                    <label htmlFor="price-from">From: </label>
                    <input type="date" className="form-control" id="price-from"  onChange={e => setStartDate(e.target.value)}/>
                    <p className='error' id='start-error'></p>
                    <label htmlFor="price-to">To: </label>
                    <input type="date" className="form-control" id="price-to" onChange={e => setEndDate(e.target.value)}/>
                    <p className='error' id='end-error'></p>
                    </>) : (
                        <></>
                    )}
                    
                </div>
            </div>
        </div>
        <p> Select any amenities you provide: </p>
        <div className="form-group container-flexible">
            <ul>
                <li>
                    <input type="checkbox" className="d-inline-block" id="pool" disabled={!edit} onChange={e => setPool(e.target.checked)} checked={pool}/>
                    <label htmlFor="pool">Pool </label>
                </li>
                <li>
                    <input type="checkbox" className="d-inline-block" id="bbq" disabled={!edit} onChange={e => setBbq(e.target.checked)} checked={bbq}/>
                    <label htmlFor="bbq">BBQ </label>
                </li>
                <li>
                    <input type="checkbox" className="d-inline-block" id="wifi" disabled={!edit} onChange={e => setWifi(e.target.checked)} checked={wifi}/>
                    <label htmlFor="wifi">Wi-Fi </label>
                </li>
            </ul>
            <ul>
                <li>
                    <input type="checkbox" className="d-inline-block" id="hot-tub" disabled={!edit} onChange={e => setJacuzzi(e.target.checked)} checked={jacuzzi}/>
                    <label htmlFor="hot-tub">Hot Tub </label>
                </li>
                <li>
                    <input type="checkbox" className="d-inline-block" id="laundry" disabled={!edit} onChange={e => setLaundry(e.target.checked)} checked={laundry}/>
                    <label htmlFor="laundry">Laundry </label>
                </li>
                <li>
                    <input type="checkbox" className="d-inline-block" id="parking" disabled={!edit} onChange={e => setParking(e.target.checked)} checked={parking}/>
                    <label htmlFor="parking">Free Parking </label>
                </li>
            </ul>
            <ul>
                <li>
                    <input type="checkbox" className="d-inline-block" id="kitchen" disabled={!edit} onChange={e => setKitchen(e.target.checked)} checked={kitchen}/>
                    <label htmlFor="kitchen">Kitchen </label>
                </li>
                <li>
                    <input type="checkbox" className="d-inline-block" id="pets" disabled={!edit} onChange={e => setPets(e.target.checked)} checked={pets}/>
                    <label htmlFor="pets">Pets Allowed </label>
                </li>
                <li>
                    <input type="checkbox" className="d-inline-block" id="heat" disabled={!edit} onChange={e => setHeating(e.target.checked)} checked={heating}/>
                    <label htmlFor="heat">Air Conditioning/Heating </label>
                </li>
            </ul>
        </div>
        <div className="d-flex justify-content-center" id="button-container">
        {edit ? (
            <>  
              
                <button type="submit" className="btn btn-primary border-0 green-btn" id="save" onClick={handleSubmit}>Save Changes</button>
                <Popup 
                    buttonTitle='Delete' 
                    title = 'Please confirm'
                    descrip='This will delete your property and all associated reservations'
                    buttons={[
                        {value: "yes", label: "Confirm", variant: "success" },
                        {value: "no", label: "Cancel", variant: "danger" },
                      ]}
                    onButtonSelect={handleButtonSelect}>
                </Popup>
                
            </>
        ) : (
        <button type="submit" className="btn btn-primary border-0 green-btn" id="book" onClick={handleSubmit}>Request to book</button>
        )}
        </div>
        <p className='d-block success text-center' id='save-success'></p> 
            
        </form>
        </div>
    )};   