import { useState, useEffect } from 'react';
import './style.css'

export default function PropertyList() {
    const [properties, setProperties] = useState([]);
    const [page, setPage] = useState(1);
    const [next, setNext] = useState(false); 
    const [city, setCity] = useState(); 
    const [country, setCountry] = useState(); 
    const [guests, setGuests] = useState(); 
    const [beds, setBeds] = useState(); 
    const [order, setOrder] = useState('price'); 
    const [filter, setFilter] = useState(false); 
    
    useEffect(() => {
        var url = `http://localhost:8000/properties/search/?page=${page}`;
        if (city) {
          url += `&city=${city}`;
        }
        if (country) {
          url += `&country=${country}`;
        }
        if (guests){
            url += `&guests_gt=${guests - 1}`; 
        }
        if (beds){
            url += `&bedrooms_gt=${beds - 1}`; 
        }
        if (order){
            if (order === 'price'){
                url += `&ordering=${order}`;
            }else{
                url += `&ordering=-${order}`;
            }
             
        }
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
        .then(response => response.json())
        .then((data) => { 
            if (data.results != null){
                setProperties([...properties, ...data.results]);
            }

            if (data.next){ 
                setNext(true); 
            }else{
                setNext(false); 
            }
             
        })
        .catch(error => console.log(error));
    }, [page, filter]);
  
    function handleScroll() {
        if (Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight) {
            if (next){
                setPage(prevPage => prevPage + 1);
            }
            
        }
    }

    function handleSubmit(e){
        e.preventDefault();
        setProperties([]); 
        setPage(1); 
        if (filter){
            setFilter(false); 
        } 
        else{
            setFilter(true); 
        }
    }
  
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [next]);
  

    return (
    <div>
      <div className="row justify-content-center align-items-center" id="search-container">
        <form role="form" className="d-flex justify-content-center" onSubmit={handleSubmit}>
          <div className="d-inline-block col col-sm-2  criteria position-relative">
            <div className="row justify-content-center">
              <label className="control-label float-bottom" htmlFor="city">City <i className="fa fa-map search-icon float-right ml-0"></i></label>
            </div>
            <div className="d-inline row justify-content-center">
              <input className="rounded" type="text" id="city" onChange={(e) => setCity(e.target.value)}/>
            </div>
          </div>

          <div className="d-inline-block col col-sm-2  criteria position-relative">
            <div className="row justify-content-center">
              <label className="control-label float-bottom" htmlFor="country">Country <i className="fa fa-globe search-icon float-right ml-0"></i></label>
            </div>
            <div className="d-inline row justify-content-center">
              <input className="rounded" type="text" id="country" onChange={(e) => setCountry(e.target.value)}/>
            </div>
          </div>
  
          <div className="d-inline-block col col-sm-2 criteria position-relative" >
            <div className="row justify-content-center">
              <label className="control-label" htmlFor="guests">Guests <i className="fa fa-user search-icon float-right ml-0"></i></label>
            </div>
            <div className="row d-inline justify-content-center">
              <input className="rounded" type="number" id="guests" onChange={(e) => setGuests(e.target.value)}/>
              
            </div>
          </div>

          <div className="d-inline-block col col-sm-2 criteria position-relative" >
            <div className="row justify-content-center">
              <label className="control-label" htmlFor="beds">Beds <i className="fa fa-bed search-icon float-right ml-0"></i></label>
            </div>
            <div className="row d-inline justify-content-center">
              <input className="rounded" type="number" id="beds" onChange={(e) => setBeds(e.target.value)}/>
            </div>
          </div>

          <div className="col col-sm-1 criteria justify-content-right" id="search-btn-container">
            <button type='submit' className="btn btn-lg float-right rounded-circle border" id="search-btn" ><i className="fa fa-search"></i></button>
        </div>
            <div className="col col-sm-1 float-right rounded justify-content-right align-items-right text-right" id="sort-col">
            <label htmlFor="sort">Sort By:</label>
            <select id="sort" className="rounded" onChange={(e) => setOrder(e.target.value)}>
              <option value='price'>Price</option>
              <option value='rating'>Rating</option>
            </select>
        </div>
        </form>
       
      </div>
      <div className="container">
        <div className="row align-items-left justify-content-left">
        {properties && properties.map((property) => (
        <div key={property.pk} className="col-sm-6 border  justify-content-right align-items-left">
            <a className="prop-card" href={localStorage.getItem('token') && `/properties/${property.pk}/view`}>
            <p className='text-center'>
            {property.rating? property.rating: 0}
            <span className="fa fa-star"></span>
            </p>
            <p className="h5 text-center">
            {property.name.charAt(0).toUpperCase() + property.name.slice(1)}
            </p>
            <p className="h6 text-center">
            {property.city.charAt(0).toUpperCase() + property.city.slice(1)}, {property.country.charAt(0).toUpperCase() + property.country.slice(1)}
            </p>
            <p className="font-italic text-center">
            {property.description ? property.description.charAt(0).toUpperCase() + property.description.slice(1): ""}
            </p>
            <p className="text-center">
            ${property.price} per night
            </p>
            </a>
        </div>
        ))}
        {properties && properties.length % 2 !== 0 && (
        <div className="col-sm-6 justify-content-center align-items-center"></div>
        )}
    </div>
      </div>
    </div>
    );
}
