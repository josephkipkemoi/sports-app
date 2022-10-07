import { faBan, faCheckCircle, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import  Card  from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import styled from "styled-components";
import ChatBoxComponent from "../components/ChatBoxComponent";
import { InputNumber, Small, Span } from "../components/Html";
import MobileNavComponent from "../components/MobileNavComponent";
import { FacebookIconSvg, MailSvgIcon, SendSvgIcon, TelegramSvgIcon, TwitterSvgIcon, WhatsAppSvgIcon } from "../components/Svg";
import axios from "../lib/axios";

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
    .h2-touch {
        padding-right: 12px;
        padding-left: 12px;
        padding-top: 12px;
    }
`

export default function Contact() {
    // const [message, setMessage] = useState([])
    // const msg = new Set(message)

    // useEffect(() => {
    //     const userId = JSON.parse(localStorage.getItem('uu_id')).uu_id.id

    //     window.addEventListener('load', (e) => {
    //         Pusher.logToConsole = true

    //         let pusher = new Pusher('b36bb776d85f37fdff66', {
    //             cluster: 'ap2'
    //         })
        
    //         let channel1 = pusher.subscribe(`message-channel${userId}`)
        
    //         channel1.bind(`message.new`, function (data) {
    //             setMessage(prev => ([...prev, data.message]))
    //         }) 
    //     })
       
    // }, [message])
    return (
        <>
           
            <ChatBoxComponent />
            <MobileNavComponent/>

            {/* <ModalContainer isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/> */}

        </>
    )
}


const ModalContainer = ({ isModalOpen, setIsModalOpen }) => {
    const router = useRouter()

    const closeModal = () => {
        setIsModalOpen(false)
        router.push('/messages')
    }

    return (
        <Modal show={isModalOpen} className="pt-5 mt-5">
            <Modal.Body>
                <div className="d-flex justify-content-center m-3">
                <FontAwesomeIcon icon={faCheckCircle} size="4x" className="text-success "/>
                </div>
                <h2 className="text-center">Message Sent</h2>
                <p className="text-center">
                    Your message has been sent successfully, 
                    We hope to respond within 48 hours. 
                    You can also contact us through Social Media, 
                    links can be found below
                </p>
                <button className="btn btn-primary w-100" onClick={closeModal}>Close</button>
            </Modal.Body>
        </Modal>
    )
}