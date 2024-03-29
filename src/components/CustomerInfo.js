import React from "react";
import styled from "styled-components";
import Card  from "react-bootstrap/Card";
import configData from '../../config.json';
import { H5 } from "./Html";

const StyleCustomerInfo = styled.div`
  padding: 12px;
`
export default function CustomerInfo({ displayMode }) {
    return (
        <StyleCustomerInfo className={` ${displayMode === 'dark-mode' ? 'bg-dark text-white' : 'bg-white text-dark'}`}>
         <MpesaInfo/>
         <ContactSupport/>
         <AddedFeatures/>     
         <Offers/>
        </StyleCustomerInfo>
    )
}

const StyleMpesaInfo = styled.div`
 h6 {
  text-align: center;
  letter-spacing: 2px;
 }
 h5 {
  margin: 0;
  padding: 0;
 }
 span {
  line-height: 24px;
  letter-spacing: 2px;
  font-weight: 700;
 }
`
const MpesaInfo = () => {
    return (
      <StyleMpesaInfo>
        <div className="mt-3 rounded shadow border-0 p-3">
          <div>
            <h6 className='fw-bold'>PAYBILL NUMBERS</h6>
          </div>
          <hr/>
          <div className='d-flex justify-content-between align-items-center'>
            <span>MPESA PAYBILL</span>
            <h5 className='fw-bold'>{configData.MPESA_PAYBILL_NUMBER}</h5>
          </div>
        </div>
      </StyleMpesaInfo>
    )
  }

const ContactSupport = () => {
    return (
      <StyleMpesaInfo>
        <div className='mt-3 rounded shadow border-0 p-3'>
          <div>
            <h6 className='fw-bold'>CUSTOMER CARE</h6>
          </div>
          <hr/>
          <div>
          <div className='d-flex flex-column align-items-center text-center'>
            <span>We offer 24/7 customer care attention to {configData.APP_NAME} players</span>
            <div className='d-flex'>
            <i className="bi bi-telephone" style={{ marginRight: 10 }}></i>
            <span className='fw-bold'>        
              0763-388-846
            </span>
            </div>
            <div className='d-flex'>
              <i className="bi bi-envelope-open" style={{ marginRight: 10 }}></i>
              <span><b className='fw-bold'>customercare@pinaclebet.com</b></span>
            </div>
          </div>  
          </div>
        </div>
      </StyleMpesaInfo>
    )
  }


const StyledFeatures = styled.div`
.feature-box {
  padding: 8px;
}
h5 {
  font-weight: 700;
}
h6{
  font-weight: 700;
 }
svg {
  margin-right: 4px;
}
`

const AddedFeatures = () => {
  
  return (
    <StyledFeatures className='mt-4'>
      <h5>
        <i className="bi bi-lightning"></i>
        Features
      </h5>
      <div className='feature-box'>
        <h6>Soccer Bet Builder</h6>
        <p>
          Now available on up to 12 selections. Create your own personalised bet on any Soccer game.  T&Cs apply.
        </p>
        <small>More Details</small>
      </div>
      <div className='feature-box'>
        <h6>Live Streaming Highlights</h6>
        <p>
          A selection of the top Soccer matches you can watch at bet365 over the next few days. Eligible customers only.
        </p>
        <small>Live Streaming Rules Apply</small>
      </div>
      <div className='feature-box'>
        <h6>Cash Out</h6>
        <p>
          Giving you the opportunity to take a return before an event has finished. T&Cs apply.
        </p>
        <small>More Details</small>
      </div>
    </StyledFeatures>
  )
}


const Offers = () => {
    return (
      <StyledFeatures>
        <H5>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-snow2" viewBox="0 0 16 16">
            <path d="M8 16a.5.5 0 0 1-.5-.5v-1.293l-.646.647a.5.5 0 0 1-.707-.708L7.5 12.793v-1.086l-.646.647a.5.5 0 0 1-.707-.708L7.5 10.293V8.866l-1.236.713-.495 1.85a.5.5 0 1 1-.966-.26l.237-.882-.94.542-.496 1.85a.5.5 0 1 1-.966-.26l.237-.882-1.12.646a.5.5 0 0 1-.5-.866l1.12-.646-.884-.237a.5.5 0 1 1 .26-.966l1.848.495.94-.542-.882-.237a.5.5 0 1 1 .258-.966l1.85.495L7 8l-1.236-.713-1.849.495a.5.5 0 1 1-.258-.966l.883-.237-.94-.542-1.85.495a.5.5 0 0 1-.258-.966l.883-.237-1.12-.646a.5.5 0 1 1 .5-.866l1.12.646-.237-.883a.5.5 0 0 1 .966-.258l.495 1.849.94.542-.236-.883a.5.5 0 0 1 .966-.258l.495 1.849 1.236.713V5.707L6.147 4.354a.5.5 0 1 1 .707-.708l.646.647V3.207L6.147 1.854a.5.5 0 1 1 .707-.708l.646.647V.5a.5.5 0 0 1 1 0v1.293l.647-.647a.5.5 0 1 1 .707.708L8.5 3.207v1.086l.647-.647a.5.5 0 1 1 .707.708L8.5 5.707v1.427l1.236-.713.495-1.85a.5.5 0 1 1 .966.26l-.236.882.94-.542.495-1.85a.5.5 0 1 1 .966.26l-.236.882 1.12-.646a.5.5 0 0 1 .5.866l-1.12.646.883.237a.5.5 0 1 1-.26.966l-1.848-.495-.94.542.883.237a.5.5 0 1 1-.26.966l-1.848-.495L9 8l1.236.713 1.849-.495a.5.5 0 0 1 .259.966l-.883.237.94.542 1.849-.495a.5.5 0 0 1 .259.966l-.883.237 1.12.646a.5.5 0 0 1-.5.866l-1.12-.646.236.883a.5.5 0 1 1-.966.258l-.495-1.849-.94-.542.236.883a.5.5 0 0 1-.966.258L9.736 9.58 8.5 8.866v1.427l1.354 1.353a.5.5 0 0 1-.707.708l-.647-.647v1.086l1.354 1.353a.5.5 0 0 1-.707.708l-.647-.647V15.5a.5.5 0 0 1-.5.5z"/>
          </svg>
          Offers
        </H5>
        <div className='feature-box'>
          <h6>Soccer Accumulator Bonus</h6>
          <p>
            Earn up to 70% more. New & eligible customers only. T&Cs apply.
          </p>
          <small>More Details</small>
        </div>
        <div className='feature-box'>
          <h6>Tennis Accumulator Bonus</h6>
          <p>
            Earn up to 70% more. New & eligible customers only. T&Cs apply.
          </p>
          <small>More Details</small>
        </div>
      </StyledFeatures>
    )
  }
  