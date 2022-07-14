import axios from '../lib/axios';
import React, { useState } from "react";
import styled from "styled-components";
import { InputNumber } from "./Html";
import { CheckSvgIcon, HelpSvgIcon, SendSvgIcon } from "./Svg";

const StlyeSupport = styled.div`
    position: absolute;
    bottom: 20px;
    right: 40px;
    padding: 10px;
    width: 112px;
    cursor: pointer;
    @media screen and (max-width: 990px) {
        display: none;
      }
`

const StyleSupportForm = styled.div`
    position: absolute;
    bottom: 20px;
    right: 40px;
    width: 342px;
    border-radius: 8px;
    .set-overflow {
        max-height: 412px;
        overflow-x: hidden;
        overflow-y: scroll;
    }
    .round-header {
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
    }
`

const StyleConfirmation = styled.div`
    position: absolute;
    height: 402px;
    background: #fff;
    border-radius: 8px;
    margin-top: 60px;
    margin-left: 10px;
    margin-right: 10px;
`
export default function Support() {
    const [display, setDisplay] = useState('none')
    const [isMessageSent, setIsMessageSent] = useState(false)
    const [isBtnDisabled, setIsBtnDisabled] = useState(false)
  

    const SupportForm = () => {
        return (
            <StyleSupportForm className="bg-light" style={{ display: display }}>
                {isMessageSent ?  <MessageSentConfirmation/> : ''}               
                <FormElements/>
            </StyleSupportForm>
        )
    }

    const confirmMessageSent = () => {
        setIsMessageSent(false)
        setDisplay('none')
    }

    const changeDisplay = () => {
        setDisplay('block')
        setIsBtnDisabled(false)
    }

    
    const FormElements = () => {
        const [formDetails, setFormDetails] = useState({
            name: '',
            email: '',
            phone_number: '',
            message: ''
        });

        const handleForm = (e) => setFormDetails((prev) => ({...prev, [e.target.name] : e.target.value}))

        const submitMessage = async () => {
       
            const res = await axios.post('api/support', formDetails)
    
            if(res.status === 200) {
                setIsMessageSent(true)
                setIsBtnDisabled(true)
            }    
    
        }
        return (
            <>
             <div className="d-flex justify-content-between align-items-center bg-success text-light p-3 round-header">
                    <h6 >Leave us a message</h6>
                   <button 
                   style={{ border: 'none', background: 'none' }}
                   onClick={() => setDisplay('none')}
                   >
                       <i className="bi bi-arrow-bar-down fw-bold text-light"></i>
                    </button>
                </div>
                <div className="p-3 set-overflow">
                    <label htmlFor="name"><small>Your name (optional)</small></label>
                    <input 
                    id="name" 
                    type="text" 
                    name="name"
                    className="form-control mt-3 mb-3"
                    onChange={handleForm}
                    />

                    <label htmlFor="email"><small>Email address *</small></label>
                    <input 
                    id="email" 
                    type="email"
                    name="email" 
                    className="form-control mt-3 mb-3"
                    onChange={handleForm}
                    />

                    <label htmlFor="number"><small>Phone Number *</small></label>
                    <small className="d-block">Enter your phone number</small>
                    <InputNumber 
                    id="number"
                    name="phone_number"
                    className="form-control mt-3 mb-3"
                    onChange={handleForm}
                    />

                    <label htmlFor="message"><small>How can we help you? *</small></label>
                    <textarea 
                    id="message"
                    name="message"
                    className="form-control mt-3 mb-3" 
                    style={{ minHeight: 100 }}
                    onChange={handleForm}
                    />

                    <label htmlFor="attachments"><small>Attachments</small></label>
                    <small className="d-block">
                        <i>Accepted formats: <b className="fw-bold">jpg, jpeg, png, pdf</b></i>
                    </small>
                    <input type="file" className="form-control mt-3 mb-3" disabled/>
                </div>
                <div className="p-3 bg-secondary">
                    <button 
                    className="btn btn-light w-100" 
                    disabled={isBtnDisabled}
                    onClick={submitMessage}
                    >
                        <SendSvgIcon width="16" height="16" style={{marginRight:4}}/>
                        Send
                    </button>
                </div>
            </>
        )
    }

    const MessageSentConfirmation = () => {
        return (
            <StyleConfirmation className="p-4 text-center">
                <h3 style={{ letterSpacing: 1 }}>
                    Message Received
                    <CheckSvgIcon width="62" height="62" style={{ display: 'block', margin: '32px auto', color: 'green' }}/>
                </h3>
                <span style={{ letterSpacing: 1 }}>One of your agents will contact you within 24 to 48 hours</span>
                <button 
                className="btn btn-success w-100 mt-4"
                onClick={confirmMessageSent}
                >
                    Ok
                </button>
            </StyleConfirmation>
        )
    }
    return (
        <>
          <StlyeSupport className="rounded-pill bg-warning" onClick={changeDisplay}>
            <div className="d-flex justify-content-between align-items-center">
                <HelpSvgIcon width="24" height="24" style={{ marginLeft: 10 }}/>
                <h5 style={{ marginTop: 3, marginRight: 10 }}>Help</h5>
            </div>
        </StlyeSupport> 

        <SupportForm/>

        </>
     
    )
}