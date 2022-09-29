import { faBan, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import  Card  from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import styled from "styled-components";
import { InputNumber, Small, Span } from "../components/Html";
import { FacebookIconSvg, MailSvgIcon, SendSvgIcon, TelegramSvgIcon, TwitterSvgIcon, WhatsAppSvgIcon } from "../components/Svg";
import axios from "../lib/axios";

const StyleContact = styled.div`
    height: 100vh;
    overflow: scroll;
    background: #fff;
    textarea {
        min-height: 120px;
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
   
    const [formDetails, setFormDetails] = useState({
        name: '',
        phone_number: '',
        betId: '',
        message: ''
    });

    const { name, phone_number, betId, message } = formDetails

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [errors, setErrors] = useState([])

    const handleForm = (e) => setFormDetails((prev) => ({...prev, [e.target.name] : e.target.value}))

    const submitMessage = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('api/support', formDetails)
            if(res.status === 200) {
                setIsModalOpen(true)  
            }  
        } catch (error) {
           if(error.status !== 422) {
            console.log(error)
                setErrors(Object.values(error?.response?.data?.errors).flat())
            }
        }

    }

    const closeErrors = () => {
        setErrors([])
    }

    return (
        <StyleContact>
            <div className="h2-touch">
                <h2>Get in touch</h2>
            </div>
            <Container>
                <Card className="mt-2 border-0 shadow-sm">
                    <Card.Header className="bg-info">
                        <h3 className="text-dark">Leave us a message</h3>
                    </Card.Header>
                 
                    <Card.Body className="bg-light border-0">
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

                        <label htmlFor="name" className="mb-2">Your Name *</label>
                        <input id="name" type="text" value={name} name="name" className="form-control mb-3" onChange={handleForm}/>

                        <label htmlFor="phone_number" className="mb-2">Mobile Number *</label>
                        <InputNumber id="phone_number" value={phone_number} name="phone_number" className="form-control mb-3" onChange={handleForm}/>

                        <label htmlFor="betId" className="mb-2">Bet ID *</label>
                        <input id="betId" type="text" value={betId} name="betId" className="form-control mb-3" onChange={handleForm}/>

                        <label htmlFor="message" className="mb-2">How can we help you? *</label>
                        <textarea id="message" name="message" value={message} className="form-control mb-3" onChange={handleForm}/>

                        <label htmlFor="attachments"><small>Attachments (optional)</small></label>
                        <small className="d-block">
                            <i>Accepted formats: <b className="fw-bold">jpg, jpeg, png, pdf</b></i>
                        </small>
                        <input type="file" className="form-control mt-3 mb-3" disabled/>

                        <div className="text-center">
                            <button className="btn btn-primary" onClick={submitMessage} disabled={isModalOpen}>
                                <SendSvgIcon width="16" height="16" style={{marginRight:4}}/>
                                Send Message
                            </button>
                        </div>                   
                       
                    </Card.Body>
                </Card>
            </Container>

            <Container className="mt-3">
                <Card className="border-0 shadow-sm bg-light">
                    <Card.Header className="bg-primary text-white">
                        Chat with us via Social Media
                    </Card.Header>
                    <Card.Body>
                        <div className="d-flex justify-content-between p-1">
                            <button className="btn">
                                <FacebookIconSvg width="32" height="32" />
                            </button>
                            <button className="btn">
                                <TwitterSvgIcon width="32" height="32" />
                            </button>
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

            <ModalContainer isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>

        </StyleContact>
    )
}

const ModalContainer = ({ isModalOpen, setIsModalOpen }) => {

    const closeModal = () => {
        setIsModalOpen(false)
        // To fix later, clear input fields once data is submiteed
        window.location.reload()
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