import React from "react";
import  Row from "react-bootstrap/Row";
import  Col  from "react-bootstrap/Col";
import styled from "styled-components";
import BetslipContainer from '../components/BetslipContainer';
import CustomerInfo from '../components/CustomerInfo';
import TopNavBar from "../components/TopNavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSoccerBall } from '@fortawesome/free-solid-svg-icons'

const StyledJackpot = styled.div`
    background: #424242;
    h3 {
        letter-spacing: 1px;
    }
    span {
        letter-spacing: 1px;
        display: block;
    }
    .card-bb {
        min-height: 50vh;
    }
    .text-body {
        margin: 15vh auto;
    }
`
export default function Jackpot() {
    return (
        <StyledJackpot>
            <Row className="px-2">
                <Col lg="9" md="9" sm="12" style={{ padding: 0 }}> 
                    <TopNavBar/>
                    {/* <NoJackpotAvailable/> */}
                    <JapckpotContainer/>
                </Col>
                <Col lg="3" md="3" sm="12" style={{ paddingLeft: 0 }}>
                    <BetslipContainer/>
                    <CustomerInfo/>
                </Col>
            </Row>       
        </StyledJackpot>
    )
}

const NoJackpotAvailable = () => {
    return (
        <div className="text-center mt-5 text-white p-5">
            <span>No games available! Check again later</span>
        </div>
    )
}

const JapckpotContainer = () => {
    return (
        <Row className="p-3" style={{ padding: 0, margin: 0 }}>
            <div 
            className="d-flex align-items-center justify-content-between text-white p-3 bg-dark rounded shadow-sm mb-3"
            >
                <button style={{ margin: 0, padding: 0, background: 'none', border: 'none' }}>
                    <FontAwesomeIcon icon={faSoccerBall} className="text-white"/>
                </button>
                <div className="d-flex align-items-center">
                    <span className="fw-bold" >JACKPOT</span>
                    <span className="text-warning" style={{ marginRight: 10, marginLeft: 10 }}>KSH 42,908,099.00</span>
                    <span>10 Games</span>
                </div>
                <button style={{ margin: 0, padding: 0, background: 'none', border: 'none' }}>
                    <i className="bi bi-printer"  style={{ color: '#ffffff' }}></i>                
                </button>
            </div>
            <Col lg="9" md="9" sm="9">
                <div className="d-flex align-items-center">
                    <span className="text-white" >1</span>
                    <div style={{ marginLeft: 20 }}>
                        <small className="text-light">28/10/2022 - 17:00</small>
                        <span className="text-white">Crystal Palace</span>
                        <span className="text-white">Arsenal</span>
                    </div>
                </div>
            </Col>
            <Col lg="3" md="3" sm="3">
                <div className="d-flex justify-content-between text-light">
                    <span className="mx-auto">Home</span>
                    <span className="mx-auto">Draw</span>
                    <span className="mx-auto">Away</span>
                </div>
                <div className="d-flex justify-content-between text-light">
                    <button className="btn btn-success w-100">1.25</button>
                    <button className="btn btn-success w-100">2.25</button>
                    <button className="btn btn-success w-100">3.25</button>
                </div>
            </Col>
        </Row>
    )
}