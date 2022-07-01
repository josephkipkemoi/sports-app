import React, { useState } from "react";
import styled from "styled-components";
import { InputNumber } from "./Html";

const StlyeSupport = styled.div`
    position: absolute;
    bottom: 20px;
    right: 40px;
    padding: 10px;
    width: 112px;
    cursor: pointer;
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
export default function Support() {
    const [display, setDisplay] = useState('none')
    const SupportForm = () => {
        return (
            <StyleSupportForm className="bg-light" style={{ display: display }}>
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
                    <input id="name" type="text" className="form-control mt-3 mb-3"/>

                    <label htmlFor="email"><small>Email address</small></label>
                    <input id="email" type="email" className="form-control mt-3 mb-3"/>

                    <label htmlFor="number"><small>Phone Number</small></label>
                    <small className="d-block">Enter your phone number</small>
                    <InputNumber className="form-control mt-3 mb-3"/>

                    <label htmlFor="message"><small>How can we help you?</small></label>
                    <input type="text" className="form-control mt-3 mb-3" style={{ minHeight: 100 }}/>

                    <label htmlFor="attachments"><small>Attachments</small></label>
                    <input type="file" className="form-control mt-3 mb-3"/>
                </div>

                <button className="btn btn-dark m-3 float-end">Send</button>
            </StyleSupportForm>
        )
    }
    return (
        <>
          <StlyeSupport className="rounded-pill bg-warning" onClick={() => setDisplay('block')}>
            <div className="d-flex justify-content-between align-items-center">
                <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                fill="currentColor" 
                className="bi bi-question-circle" 
                viewBox="0 0 16 16"
                style={{ marginLeft: 10 }}
                >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                </svg>
                <h5 style={{ marginTop: 3, marginRight: 10 }}>Help</h5>
            </div>
        </StlyeSupport> 

        <SupportForm/>
        </>
     
    )
}