import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import axios from "../lib/axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimes, faHeadset, faMessage } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
const StyleNotificationCount = styled.div`

    small {
        height: 16px;
        width: 16px;
        margin-left: -8px;
        margin-top: -5px;
        border: 1px solid #fff;
        font-size: 9.8px;
    }
    .customer-care {
        margin-right: 18px;
    }
`
export default function NotificationComponent({ user }) {
    const [notificationsLength, setNotificationLength] = useState(0)
    const [notificationOpen, setNotificationOpen] = useState(false)
    const [unreadData, setUnreadData] = useState([])

    const handleNotification = () => {
        if(notificationOpen) {
            setNotificationOpen(false)
        }
        if(!notificationOpen) {
            handleReadNotifications()
            fetchUnreadNotifications()
            setNotificationOpen(true)
        }
    }

    const fetchUnreadNotifications = async () => {
        const data = await axios.get(`api/notifications/unread/users?u_id=${user?.uu_id.id}`)

        setNotificationLength(data.data.length)
        setUnreadData(data.data) 
    }

    const handleReadNotifications = async () => {
        await axios.get(`api/notifications/markRead/users?u_id=${user?.uu_id.id}`)
     }

    useEffect(() => {
        fetchUnreadNotifications()
    }, [])
    return (
        <>
           {Boolean(user?.uu_id?.id) ?
           <StyleNotificationCount className='d-flex align-items-center' >
                <div className='customer-care'>
                    <Link href="/contact">
                        <a
                            itemProp='url'
                        >
                            <FontAwesomeIcon icon={faHeadset} className="text-white" size='xl'/>
                        </a>
                    </Link>
                </div>
                <div className='customer-care'>
                    <Link href="/messages">
                        <a
                            itemProp='url'
                        >
                            <FontAwesomeIcon icon={faMessage} className="text-white" size='xl'/>
                        </a>
                    </Link>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    fill="currentColor" 
                    className="bi bi-bell text-white bg-none rounded-circle" 
                    viewBox="0 0 16 16"
                    style={{ cursor: 'pointer' }}
                    onClick={handleNotification}
                >
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
                </svg>
                {notificationsLength === 0 ? 
                '' 
                : 
                <small 
                    className='text-white bg-danger rounded-circle text-center fw-bold'                    
                >
                    {notificationsLength}
                </small> }
             
                {notificationOpen ? <NotificationContainer handleNotification={handleNotification} handleReadNotifications={handleReadNotifications} unreadData={unreadData} setNotificationLength={setNotificationLength} setNotificationOpen={setNotificationOpen} user_id={user?.uu_id?.id} />  : '' }
                      
           </StyleNotificationCount>
            : <div></div>}
        </>
     
    )
}

const StyleNotificationContainer = styled.div`
    position: absolute;
    right: 0;
    left: 0;
    margin-left: 0;
    margin-right: 0;
    top: 34px;
    background: white;
    width: 90vw;
    height: auto;
    border-radius: .5rem;
    padding-bottom: .25rem;
    .icon-div {
        width: 20%;
    }
    .message-div {
        width: 70%;
    }
    .times-div {
        width: 10%;
        text-align: center;
    }
`

const NotificationContainer = ({  user_id, unreadData, handleReadNotifications, handleNotification }) => {

    const [allData, setAllData] = useState([]) 

    const fetchAllNotifications =  async () => {
        const data = await axios.get(`api/notifications/all/users?u_id=${user_id}`)
        setAllData(data.data)

    }

    const [activeNotification, setActiveNotification] = useState(1)

    const setActiveNotificationTab = (e) => {
        if(e.target.name === 'all') {
            setActiveNotification(1)
        }
        if(e.target.name === 'unread') {
            setActiveNotification(2)
        }
    }

  

    const NotificationElements = (l, i) => {
 
        return (
            <div key={i} className={`d-flex align-items-center justify-content-between alert alert-info shadow-sm border-0 ${Boolean(l.read_at) ? "opacity-50" : "opacity-100"} `}>   
                <div className='icon-div'>
                    <FontAwesomeIcon icon={faCheckCircle} size="3x" className='text-success'/>
                </div>
                <div className='message-div'>
                    <span>{l.data.message}</span>
                </div>
                <div className='times-div'>
                    <FontAwesomeIcon icon={faTimes}/>
                </div>
            </div>
        )
    }
 
    useEffect(() => {
        fetchAllNotifications()
    }, [])

    return (
        <StyleNotificationContainer className='mx-auto p-3'>
            <div className='d-flex align-items-start justify-content-between mt-2 mb-3'>
                <h3 className='fw-bold'>Notifications</h3>
                <FontAwesomeIcon icon={faTimes} size="lg" className="p-1" onClick={handleNotification}/>
            </div>
            <div className='mb-2'>
            <hr style={{ color: 'lightgray' }}/>
                <button 
                    className={`btn btn-warning rounded-pill m-1 ${activeNotification === 1 ? 'active' : ''}`}
                    name="all" 
                    onClick={setActiveNotificationTab}
                >
                    All
                </button>
                <button 
                    className='btn btn-warning rounded-pill' 
                    name="unread" 
                    onClick={setActiveNotificationTab}
                >
                    Unread
                </button>
            </div>
            <hr style={{ color: 'lightgray' }}/>

            <div className='w-100 mt-3'>
                <button 
                    className='w-100  btn btn-outline-danger' 
                    onClick={handleReadNotifications}
                >
                    Mark all as read
                </button>
            </div>
            <hr style={{ color: 'lightgray' }}/>
            <div className='mt-3'>
                {activeNotification === 1 && allData.map(NotificationElements)}
                {activeNotification === 2 && unreadData.map(NotificationElements)}
            </div>
        </StyleNotificationContainer>
    )
}