import { useState, useEffect } from 'react';
import './style.css'

export default function Notification() {
    const [notifs, setNotifs] = useState([]);
    const [filter, setFilter] = useState(false); 
    const [page, setPage] = useState(1);
    const [next, setNext] = useState(false); 
    
    useEffect(() => {
        var url = `http://localhost:8000/notifications/view/?page=${page}`;
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
            if (data.results != null){
                setNotifs([...notifs, ...data.results]);
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

    function handleDeleteNotif(pk){
        var url = `http://localhost:8000/notifications/` + pk + `/clear/`;
        const token = localStorage.getItem('token');

        fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
            if(response.status === 204){
                reset(); 
            } 
        })

        .catch(error => console.log(error));
    }   

    function handleReadNotif(pk){
        var url = `http://localhost:8000/notifications/` + pk + `/read/`;
        const token = localStorage.getItem('token');

        fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
            if(response.status === 200){
                reset(); 
            } 
        })

        .catch(error => console.log(error));
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, [next]);

    function reset() {
        setNotifs([]); 
        setPage(1); 
        if (filter){
            setFilter(false); 
        } 
        else{
            setFilter(true); 
        }
    }

    return (
        <div className="containerr">
            <div className="row justify-content-center">
                {notifs && notifs.map((notif, index) => (
                <div key={index} className={`col-sm-12 border prop-card ${notif.state === "unread" ? "unread" : ""}`}>
                    <div className="d-flex align-items-center">
                    <div className="flex-grow-1 text-center">
                        <p className="h6">Reagrding: {notif.property_name}</p>
                    </div>
                    <button className="rounded btn border-0" onClick={() => handleDeleteNotif(notif.pk)}>
                        <i className="fa fa-xmark"></i>
                    </button>
                    </div>
                    <div className="d-flex align-items-center">
                    <div className="flex-grow-1 text-center">
                        <p className="text-center">
                            <span className="fw-bold">{notif.start_date}</span>
                            <span> - </span>
                            <span className="fw-bold">{notif.end_date}</span>
                        </p>
                    </div>
                    
                    <button className="rounded btn border-0" onClick={() => handleReadNotif(notif.pk)}>
                        <i className="fa fa-check"></i>
                    </button>

                    </div>
                    <p className="text-center">Recieved at: {new Date(notif.timestamp).toLocaleString()}</p>
                    <p className="text-center">{notif.display}</p>
                </div>
                ))}
            </div>
        </div>

    );
}
