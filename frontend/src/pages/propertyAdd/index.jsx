import React, { useState } from 'react';
import './style.css'

export default function PropertyAdd() {
    const [name, setName] = useState(''); 
    const [address1, setAddress1] = useState(''); 
    const [address2, setAddress2] = useState(''); 
    const [city, setCity] = useState(''); 
    const [country, setCountry] = useState(''); 
    const [postalCode, setPostalCode] = useState(''); 
    const [guests, setGuests] = useState(0); 
    const [beds, setBeds] = useState(0); 
    const [baths, setBaths] = useState(0); 
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

    function handleSubmit(e){
        e.preventDefault(); 
        var error_message = false; 
        if (!name){
            var error = document.getElementById("name-error"); 
            error.textContent = "Please provide a name for your property"; 
            error_message = true; 
        }else{
            var error = document.getElementById("name-error"); 
            error.textContent = ""; 
        }

        if (!address1){
            var error = document.getElementById("address-error"); 
            error.textContent = "Please provide an address for your property"; 
            error_message = true; 
        }else{
            var error = document.getElementById("address-error"); 
            error.textContent = ""; 
        }

        if (!city){
            var error = document.getElementById("city-error"); 
            error.textContent = "Please specify the city your property is in"; 
            error_message = true; 
        }else{
            var error = document.getElementById("city-error"); 
            error.textContent = ""; 
        }

        if (!country){
            var error = document.getElementById("country-error"); 
            error.textContent = "Please specify the country your property is in"; 
            error_message = true; 
        }else{
            var error = document.getElementById("country-error"); 
            error.textContent = ""; 
        }

        if (!postalCode){
            var error = document.getElementById("postal-error"); 
            error.textContent = "Please specify your property's postal code"; 
            error_message = true; 
        }else{
            var error = document.getElementById("postal-error"); 
            error.textContent = ""; 
        }

        if (guests === 0){
            var error = document.getElementById("guests-error"); 
            error.textContent = "Please specify how many guests your property can house"; 
            error_message = true; 
        }else{
            var error = document.getElementById("guests-error"); 
            error.textContent = ""; 
        }

        if (beds === 0){
            var error = document.getElementById("beds-error"); 
            error.textContent = "Please specify how many bedrooms your property has"; 
            error_message = true; 
        }else{
            var error = document.getElementById("beds-error"); 
            error.textContent = ""; 
        }

        if (baths === 0){
            var error = document.getElementById("baths-error"); 
            error.textContent = "Please specify how many bathrooms your property has"; 
            error_message = true; 
        }else{
            var error = document.getElementById("baths-error"); 
            error.textContent = ""; 
        }

        if (price === 0){
            var error = document.getElementById("price-error"); 
            error.textContent = "Please specify the price of the property per night"; 
            error_message = true; 
        }else{
            var error = document.getElementById("price-error"); 
            error.textContent = ""; 
        }

        if (error_message){
            return; 
        }

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
            wifi: wifi, 
            parking: parking, 
            price: price 
        }
        body = JSON.stringify(body);
        const token = localStorage.getItem('token');
        fetch(`http://localhost:8000/properties/add/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                Authorization: `Bearer ${token}`,
            },
            body,
        })
        .then(response  => {
            if (response.status === 201) {
                alert("Property created successfully"); 
                window.location.href = '/search';
            }
        })
        .catch(error => console.log(error));
    }


    return (
    <div className="d-flex justify-content-center body-end" style={{ paddingTop: '20px' }}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name: </label>
          <input type="text" className="form-control" id="name" onChange={e => setName(e.target.value)}/>
          <p className='error' id='name-error'></p>
        </div>
        <div className="form-group">
          <label htmlFor="address">Address Line 1: </label>
          <input type="text" className="form-control" id="address" onChange={e => setAddress1(e.target.value)}/>
          <p className='error' id='address-error'></p>
        </div>
        <div className="form-group">
          <label htmlFor="address2">Address Line 2: </label>
          <input type="text" className="form-control" id="address2" onChange={e => setAddress2(e.target.value)}/>
        </div>
        <div className="form-group">
          <label htmlFor="city">City: </label>
          <input type="text" className="form-control" id="city" onChange={e => setCity(e.target.value)}/>
          <p className='error' id='city-error'></p>
        </div>
        <div className="form-group">
          <label htmlFor="country">Country: </label>
          <input type="text" className="form-control" id="country" onChange={e => setCountry(e.target.value)}/>
          <p className='error' id='country-error'></p>
        </div>
        <div className="form-group">
          <label htmlFor="postal-code">Postal Code: </label>
          <input type="text" className="form-control" id="postal-code"  onChange={e => setPostalCode(e.target.value)}/>
          <p className='error' id='postal-error'></p>
        </div>
        <div className="form-group">
          <label htmlFor="guests">Number of guests allowed: </label>
          <input type="number" className="form-control" id="guests"  onChange={e => setGuests(e.target.value)}/>
          <p className='error' id='guests-error'></p>
        </div>
        <div className="form-group">
          <label htmlFor="beds">Number of beds: </label>
          <input type="number" className="form-control" id="beds"  onChange={e => setBeds(e.target.value)}/>
          <p className='error' id='beds-error'></p>
        </div>
        <div className="form-group">
          <label htmlFor="baths">Number of baths: </label>
          <input type="number" className="form-control" id="baths" onChange={e => setBaths(e.target.value)}/>
          <p className='error' id='baths-error'></p>
        </div>
        <div className="form-group">
          <label htmlFor="description">Tells us about your property </label>
          <textarea className="form-control" id="description" placeholder="This property is amazing because ..." onChange={e => setDetails(e.target.value)}/>
        </div>
        <div className="d-block">
                <text>Pricing Information</text>
                <div className="border rounded d-inline-block w-100" id="pricing-container">
                    <div className="form-group">
                        <label htmlFor="price">Per night: </label>
                        <input type="number" className="form-control" id="price" onChange={e => setPrice(e.target.value)} ></input>
                        <p className='error' id='price-error'></p>
                    </div>
                </div>
            </div>
        <p>Select any amenities you provide:</p>
        <div className="form-group container-flexible">
            <ul>
                <li>
                <input type="checkbox" className=" d-inline-block" id="pool" onChange={e => setPool(e.target.value)}/>
                <label htmlFor="pool">Pool</label>
                </li>

                <li>
                    <input type="checkbox" className=" d-inline-block" id="bbq" onChange={e => setBbq(e.target.value)}/>
                    <label htmlFor="bbq">BBQ </label>
                </li>

                <li>
                    <input type="checkbox" className=" d-inline-block" id="wifi" onChange={e => setWifi(e.target.value)}/>
                    <label htmlFor="wifi">Wi-Fi </label>
                </li>
            </ul>

            <ul>
                <li>
                    <input type="checkbox" className=" d-inline-block" id="hot-tub" onChange={e => setJacuzzi(e.target.value)}/>
                    <label htmlFor="hot-tub">Hot Tub </label>
                </li>
                <li>
                    <input type="checkbox" className=" d-inline-block" id="laundry" onChange={e => setLaundry(e.target.value)}/>
                    <label htmlFor="laundry">Laundry </label>
                </li>
                <li>
                    <input type="checkbox" className=" d-inline-block" id="parking" onChange={e => setParking(e.target.value)}/>
                    <label htmlFor="parking">Free Parking </label>
                </li>

            </ul>
            <ul>
                <li>
                    <input type="checkbox" className=" d-inline-block" id="kitchen" onChange={e => setKitchen(e.target.value)}/>
                    <label htmlFor="kitchen">Kitchen </label>
                </li>
                
                <li>
                    <input type="checkbox" className=" d-inline-block" id="pets" onChange={e => setPets(e.target.value)}/>
                    <label htmlFor="pets">Pets Allowed </label>
                </li>
                <li>
                    <input type="checkbox" className=" d-inline-block mr-0 p-0" id="heat" onChange={e => setHeating(e.target.value)}/>
                    <label htmlFor="heat">Air Conditioning/Heating </label>
                </li>
            </ul>
        </div>
        <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary border-0 green-btn" >List Property</button>
        </div>
    </form>
</div>
    )}; 
        
