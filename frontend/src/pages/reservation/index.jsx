import { useState, useEffect } from 'react';
import './style.css'
import Popup from '../../components/Popup/Popup';

export default function Reservation() {
    const [resos, setResos] = useState([]);
    const [status, setStatus] = useState(); 
    const [userType, setUserType] = useState(); 
    const [tempUserType, setTempUserType] = useState(); 
    const [filter, setFilter] = useState(false); 
    const [page, setPage] = useState(1);
    const [next, setNext] = useState(false); 
    
    useEffect(() => {
        var url = `http://localhost:8000/reservations/view/?page=${page}`;
        const token = localStorage.getItem('token');

        if (status && status !== 'all'){
            url += `&status=${status}`;
        }
        if (userType){
            url += `&user_type=${userType}`
        }else{
            url += `&user_type=host`
            setUserType('host'); 
        }

        fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then((data) => { 
            if (data.results != null){
                setResos([...resos, ...data.results]);
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

    function reset() {
        setResos([]); 
        setPage(1); 
        setUserType(tempUserType); 
        if (filter){
            setFilter(false); 
        } 
        else{
            setFilter(true); 
        }
    }

    function handleSubmit(e){
        e.preventDefault();
        reset(); 
    }

   
  
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
      
    }, [next]);
    
    function handleApprovePending(pk){
        var url = `http://localhost:8000/reservations/` + pk + `/host/pending/approve/`;
        const token = localStorage.getItem('token');

        fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        })
        .then(response => response.json())
        .catch(error => console.log(error));
        
        setTimeout(() => {
            reset();
        }, 800);   
    }

    function handleApproveCancel(pk){
        var url = `http://localhost:8000/reservations/` + pk + `/host/cancel/approve/`;
        const token = localStorage.getItem('token');

        fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        })
        .then(response => response.json())
        .catch(error => console.log(error));
        
        setTimeout(() => {
            reset();
        }, 800); 
    }

    function handleDenyPending(pk){
        var url = `http://localhost:8000/reservations/` + pk + `/host/pending/deny/`;
        const token = localStorage.getItem('token');

        fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        })
        .then(response => response.json())
        .catch(error => console.log(error));
        
        setTimeout(() => {
            reset();
        }, 800); 
    }

    function handleDenyCancel(pk) {
        var url = `http://localhost:8000/reservations/` + pk + `/host/cancel/deny/`;
        const token = localStorage.getItem('token');

        fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        })
        .then(response => response.json())
        .catch(error => console.log(error));
        
        setTimeout(() => {
            reset();
        }, 800); 
    }

    function handleCancel(pk){
        var url = `http://localhost:8000/reservations/` + pk + `/guest/cancel/`;
        const token = localStorage.getItem('token');

        fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        })
        .then(response => response.json())
        .catch(error => console.log(error));
        
        setTimeout(() => {
            reset();
        }, 800); 
    }

    function handleTerminate(pk){
        var url = `http://localhost:8000/reservations/` + pk + `/host/terminate/`;
        const token = localStorage.getItem('token');

        fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        })
        .then(response => response.json())
        .catch(error => console.log(error));
        
        setTimeout(() => {
            reset();
        }, 800); 
    }




    return (
    <div>
      <div className="row justify-content-center align-items-center rounded" id="search-container">
        <form role="form" className="d-flex justify-content-center" onSubmit={handleSubmit}>
            <div className='col col-sm-6 float-right rounded justify-content-right align-items-right text-right search-by'>
                <div id="row status-col">
                    <label htmlFor="status">Status:</label>
                    <select id="status" className="rounded" onChange={(e) => setStatus(e.target.value)}>
                        <option value='all'>All</option>
                        <option value='pending'>Pending</option>
                        <option value='approved'>Approved</option>
                        <option value='completed'>Completed</option>
                        <option value='cancelled'>Cancelled</option>
                        <option value='terminated'>Terminated By Host</option>
                        <option value='current'>In progress</option>
                        <option value='denied'>Denied Booking</option>
                        <option value='cancel-pending'>Pending cancellation </option>
                    </select>
                </div>
            </div>
            <div className='col col-sm-6 float-right rounded justify-content-right align-items-right text-right search-by'>
            <label htmlFor="type">Reservations made by:</label>
            <select id="type" className="rounded" onChange={(e) => setTempUserType(e.target.value)}>
              <option value='host'>Guests</option>
              <option value='guest'>You</option>
            </select>
            </div>

        <div className="col col-sm-2 criteria justify-content-right" id="search-btn-container">
            <button type='submit' className="btn btn-lg float-right rounded-circle border" id="search-btn" ><i className="fa fa-search"></i></button>
        </div>
        </form>
       
      </div>
      <div className="container justify-content-center">
        <div className="row">
        {resos && resos.map((reso, index) => (
        <div key={index} className="col-sm-6 border prop-card align-items-center">
            <p className='text-center h5'>
                {reso.property_name.charAt(0).toUpperCase() + reso.property_name.slice(1)}
            </p>
            <p className="h6 text-center">
                {reso.status.charAt(0).toUpperCase() + reso.status.slice(1)}
            </p>
            <p className="text-center">
                From: {reso.start_date}  To: {reso.end_date}
            </p>
            <p className="text-center">
                Booked by: {reso.guest_name}
            </p>
            <p className="text-center">
                Number of guests: {reso.guests}
            </p>
            <div className='text-center'>

                {userType === 'host' && reso.status === 'pending'? (
                    <div className='justify-content-center align-items-center '>
                        <button className='rounded btn btn-success' title='This will confirm the booking.' onClick={() => handleApprovePending(reso.pk)}>Approve</button>
                        <Popup 
                            buttonTitle='Deny' 
                            title = 'Please confirm'
                            descrip='This will alert the guest that their booking request was denied.'
                            buttons={[
                            {value: "yes", label: "Confirm", variant: "success" },
                            {value: "no", label: "Cancel", variant: "danger" },
                            ]}
                            onButtonSelect={() => handleDenyPending(reso.pk)}>
                        </Popup>
                    </div>
                ) : null }
                {userType === 'host' && reso.status === 'cancel-pending'? (
                    <div className='justify-content-center align-items-center'>
                        <button className='rounded btn btn-success' title='This will confirm the cancellation of the booking' onClick={() => handleApproveCancel(reso.pk)}>Approve</button>
                        <Popup 
                            buttonTitle='Deny' 
                            title = 'Please confirm'
                            descrip='This will alert the guest that their cancellation request was denied.'
                            buttons={[
                            {value: "yes", label: "Confirm", variant: "success" },
                            {value: "no", label: "Cancel", variant: "danger" },
                            ]}
                            onButtonSelect={() => handleDenyCancel(reso.pk)}>
                        </Popup>
                    </div>
                ) : null }
                {userType === 'host' && (reso.status === 'approved' )? (
                    <div className='justify-content-center align-items-center'>
                        <Popup 
                            buttonTitle='Terminate' 
                            title = 'Please confirm'
                            descrip='This will alert the guest that you terminated their booking. You will need to provide a refund. '
                            buttons={[
                            {value: "yes", label: "Confirm", variant: "success" },
                            {value: "no", label: "Cancel", variant: "danger" },
                            ]}
                            onButtonSelect={() => handleTerminate(reso.pk)}>
                        </Popup>
                    </div>
                ) : null }
                {userType === 'guest' && (reso.status === 'pending' || reso.status === 'approved')? (
                    <div className='justify-content-center align-items-center'>
                        <Popup 
                            buttonTitle='Cancel' 
                            title = 'Please confirm'
                            descrip='This will alert the host that you no longer wish to book this property.'
                            buttons={[
                            {value: "yes", label: "Confirm", variant: "success" },
                            {value: "no", label: "Cancel", variant: "danger" },
                            ]}
                            onButtonSelect={() => handleCancel(reso.pk)}>
                        </Popup>
                    </div>
                ) : null }
            </div>
        </div>
        ))}
        {resos && resos.length % 2 !== 0 && (
        <div className="col-sm-6 justify-content-center align-items-center"></div>
        )}
    </div>
      </div>
    </div>
    );
}
