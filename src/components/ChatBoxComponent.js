import { faBan, faCheckCircle,faTimesCircle, faHeadset, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import  Card  from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import styled from "styled-components";
import { FacebookIconSvg, MailSvgIcon, SendSvgIcon, TelegramSvgIcon, TwitterSvgIcon, WhatsAppSvgIcon } from "../components/Svg";
import axios from "../lib/axios";
import { Small, Span } from "./Html";
import Echo from "laravel-echo";

const StyleContact = styled.div`
    height: 100vh;
    overflow: scroll;
    background: #fff;
    textarea {
        min-height: 60px;
    }
    .icon-width {
        width: 48px;    
    }
    .close-btn {
        position: absolute;
        right: 18px;
        top: 24px;
    }
    h3 {
        margin: 0;
        padding: 0;
    }
    .h3-small {
        font-size: 10px;
        margin-left: 8px;
        margin-top: 3px;
        letter-spacing: 1px;
    }
    .status-icon {
        margin-left: 4px;
    }
`

export default function ChatBoxComponent() {
    const inputRef = useRef(null)
    const [formDetails, setFormDetails] = useState({
        name: '',
        phone_number: '',
        betId: '',
        message: '',
        user_id: ''
    });

    const [customMsg, setCustomMsg] = useState('Offline')

    const { phone_number, message } = formDetails

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [errors, setErrors] = useState([])

    const handleForm = (e) => setFormDetails((prev) => ({...prev, [e.target.name] : e.target.value}))

    const submitMessage = async (e) => {
        e.preventDefault()

        setFormDetails(prev => ({...prev, message: ''}))
        try {
            const res = await axios.post('api/support', formDetails) 
                   
            if(res.status === 200) {
             
            }  
        } catch (error) {
           if(error.status !== 422) {
                setErrors(Object.values(error?.response?.data?.errors).flat())
            }
        }
      
    }

    const closeErrors = () => {
        setErrors([])
    }

    useEffect(() => {
        // inputRef.current.focus()
        setFormDetails((prev) => ({...prev, 
            name: 'customer care',
            user_id: JSON.parse(localStorage.getItem('uu_id')).uu_id.id,
            betId: '1001',
            phone_number: JSON.parse(localStorage.getItem('uu_id')).uu_id.phone_number,
        }))

     
    }, [])
 
    return (
        <StyleContact>
            <Container>
                <Card className="mt-2 border-0 shadow-sm mb-4">
                    <Card.Header className="bg-primary rounded-pill shadow mb-2 border-0 ">
                        <h3 className="text-white d-flex align-items-center">
                            <FontAwesomeIcon 
                                icon={faHeadset} 
                                className="text-white bg-warning p-2 rounded-circle shadow" 
                                size='1x'
                                style={{ marginRight: 8 }}
                            /> 
                            Live Chat <small className="h3-small text-white">Typically replies in a few hours</small>
                        </h3>
                    </Card.Header>
                 
                    <Card.Body className="bg-white border-0">
                        <span className="d-block">
                            Status:
                            <span className="status-icon">
                                {customMsg === 'Offline' ? 
                                <FontAwesomeIcon icon={faTimesCircle} className="text-danger"/> :  
                                <FontAwesomeIcon icon={faCheckCircle} className="text-success" />}
                                <span style={{ marginLeft: 6 }}>
                                    {customMsg}
                                </span>
                            </span>
                        </span>
                    
                        <div className="mt-1 mb-3">
                            <small>
                                Wait till status changes to <code>Online</code> before sending message.
                                Try reloading page.
                            </small>
                        </div>
                        <hr className="text-secondary"/>
                        {errors.length > 0 ? 
                          <div className="alert alert-warning mt-2" role="alert">
                            <Span className="d-flex align-items-center">
                                <div className="align-items-center icon-width">
                                    <FontAwesomeIcon icon={faBan} size="2x"/>
                                </div>
                                <div className="align-items-center">
                                    <h6 className="fw-bold">Support Contact Failed</h6>
                                    {errors[0]}
                                </div>     
                                <Small className="close-btn fw-bold" onClick={closeErrors}>X</Small>                           
                            </Span>
                         </div>
                        : ''}

                        <ChatBoxElement setCustomMsg={setCustomMsg}/>                                       
                       
                    </Card.Body>
                    <Card.Footer className="border-0">

                        <textarea 
                            ref={inputRef} 
                            name="message" 
                            value={message} 
                            className="form-control mb-3" 
                            onChange={handleForm}
                            placeholder="Write message here..."
                        />  

                        <div className="text-center">
                            <button 
                                className="btn btn-primary" 
                                onClick={submitMessage} 
                                disabled={isModalOpen}
                            >
                                <SendSvgIcon width="16" height="16" style={{marginRight:4}}/>
                                Send Message
                            </button>
                        </div>   
                    </Card.Footer>
                </Card>
            </Container>

            <Container className="mt-3">
                <Card className="border-0 shadow-sm bg-light">
                    <Card.Header className="bg-primary text-white">
                        Chat with us via Social Media
                    </Card.Header>
                    <Card.Body>
                        <div className="d-flex flex-wrap justify-content-around p-1">
                            <a className="btn" target="_blank" href="https://www.facebook.com/profile.php?id=100083982219762">
                                <FacebookIconSvg width="32" height="32" />
                            </a>
                            <a className="btn" target="_blank" href="https://twitter.com/pinaclebet">
                                <TwitterSvgIcon width="32" height="32" />
                            </a>
                            <button className="btn">
                                <WhatsAppSvgIcon width="32" height="32"/>
                            </button>
                            <button className="btn">
                                <TelegramSvgIcon width="32" height="32" />
                            </button>
                            <button className="btn">
                                <MailSvgIcon width="32" height="32"/>
                            </button>
                        </div>                      
                    </Card.Body>
                </Card>
            </Container>

        </StyleContact>
    )
}


const StyleChatBox = styled.div`
    min-height: 120px;
    .phone {
        margin-left: 5px;
    }
`
const ChatBoxElement = ({ setCustomMsg }) => {
    const router = useRouter()

    const [chatMessage, setChatMessage] = useState([{
        message: 'Hey there! Welcome to Pinaclebet. What can we help you with today?',
        sender: ''
    }])
    
    useEffect(() => {
        const userId = JSON.parse(localStorage.getItem('uu_id')).uu_id.id

        window.addEventListener('load', (e) => {

            // Pusher.logToConsole = true
            window.Echo = new Echo({
                broadcaster: 'pusher',
                wsHost: window.location.hostname,
                key: 'b36bb776d85f37fdff66',
                wsPort: 6001,
                cluster: 'ap2',
                forceTLS: true,
                encrypted: true,
            })

            window.Echo.channel(`message-channel${userId}`)
                        .listen('.message.new', function(e){
                    setChatMessage(prev => ([...prev, {message: e.message, sender: e.sender}]))
            })

        })
    }, [chatMessage, router.route])

    const MessageElement = (d, i) => {
 
        return (
            <div key={i} className={`d-flex ${d.sender === 'UserAgent' ? 'flex-row-reverse ': 'flex-row '} align-items-end mb-4`}>
                    {d.sender === 'UserAgent' ? 
                     <FontAwesomeIcon 
                        icon={faUser} 
                        className="text-white bg-info p-2 rounded-circle shadow" 
                        size='lg'
                        style={{ marginRight: 8, marginLeft: 8 }}
                    />
                    : 
                    <FontAwesomeIcon 
                        icon={faHeadset} 
                        className="text-white bg-info p-2 rounded-circle shadow" 
                        size='lg'
                        style={{ marginRight: 8 }}
                    />  }
                   
                    <div >
                      {/* <small className="text-secondary phone">{ d.sender === 'UserAgent' ? '+' + phoneNumber : 'Customer Care'}</small> */}
                   
                    <div className="bg-light rounded-pill p-3 shadow">
                     <span className="text-dark">{d.message}</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <StyleChatBox>
            {chatMessage.map(MessageElement)}
        </StyleChatBox>
    )
}