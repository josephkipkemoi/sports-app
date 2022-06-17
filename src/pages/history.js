import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from 'styled-components';
import { Span } from '../components/Html';
import useAuth from '../hooks/auth';
import axios from '../lib/axios';
import { Card } from 'react-bootstrap';
import Link from 'next/link';

const StyledHistory = styled.div`
    background-color: #ebeded;
    height: 100vh;
    overflow: scroll;
    .history-header {
        padding-top: 20px;
    }
`
export default function History() {

    const [history, setHistory] = useState([])
    const { user } = useAuth();
    
    const fetchBetHistory = async () => {
        if(!!user) {
            const response = await axios.get(`api/users/${user.id}/betslips`)
            setHistory(response?.data?.data)
        }
    }

    const BetHistoryElements = (name, i) => {
        const FixtureElements = (link, ii) => {
            return (
                <React.Fragment key={ii} >
                    <div>
                        <Span>Teams: </Span>
                        <Span>{link.betslip_teams}</Span>
                    </div>
                    <div>
                        <Span>Market: </Span>
                        <Span>{link.betslip_market}</Span>
                    </div>
                    <div>
                        <Span>Picked: </Span>
                        <Span>{link.betslip_picked}</Span>
                    </div>
                    <div>
                        <Span>Odds: </Span>
                        <Span>{link.betslip_odds}</Span>
                    </div>
                </React.Fragment>
            )
        }
        return (
            <React.Fragment key={i} >
                <div className="card p-3 m-2">
                    <div className='d-flex'>
                        <Span className='text-secondary'>
                            {new Date(name.created_at).getDate()}/
                            {new Date(name.created_at).getMonth()}/
                            {new Date(name.created_at).getFullYear()}
                        </Span>
                        <Span className='text-secondary' style={{ marginLeft: 5 }}>
                            {new Date(name.created_at).getHours()}:
                            {new Date(name.created_at).getMinutes()}
                        </Span>
                    </div>
                    <div>
                        <small>Bet ID:</small>
                        <small>{name.session_id}</small>
                    </div>
                    <div 
                    className="mt-2 d-flex align-items-center justify-content-between bg-secondary p-2 rounded text-light"
                    >   
                        {name.fixtures.length > 1 ? <span>Multi Bet</span> : <span>Single Bet</span>}
                        <Span className="text-warning">{name.betslip_status}</Span>
                    </div>
                    <div className='d-sm-flex justify-content-between mt-2 p-1'>
                        <div>
                            <Span>Stake Amount: </Span>
                            <Span className="fw-bold">KES {name.stake_amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Span>
                        </div>
                        <div>
                            <Span>Final Payout: </Span>
                            <Span className="fw-bold">KES {name.final_payout.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Span>
                        </div>  
                    </div>
                               
                </div>
                           
                {/* <div>
                    {name.fixtures.map(FixtureElements)}
                </div> */}
                <hr/>
            </React.Fragment>
        )
    }

    useEffect(() => {
        fetchBetHistory()
    },[user])

    return (
        <StyledHistory>
            <Row>
                <Col lg="3" md="3" sm="3">
                    <UserProfile user={user}/>
                </Col>
                <Col lg="9" md="9" sm="9">
                    <HistoryFilter/>         
                    {!!history.length ? history.map(BetHistoryElements): <NoBetslipHistory/>} 
                </Col>
            </Row>           
        </StyledHistory>
    )
}

const StyleUserProfile = styled.div`
padding-top: 20px;
`

const userProfileLinks = [
    {
        name: 'Transactions',
        path: '#'
    },
    {
        name: 'Deposit',
        path: '#'
    },
    {
        name: 'Withdraw',
        path: '#'
    },
]
const UserProfile = ({ user }) => {
    const { phone_number } = user;

    const UserProfileLinkElements = (link, i) => {
        return (
            <Link key={i} href={link.path}>
                <a
                    itemProp='url'
                    className='text-decoration-none text-dark d-block mb-3'
                >
                    {link.name}
                    <i className="bi bi-arrow-right-short float-end"></i>
                </a>
            </Link>
        )
    }
    return (
        <StyleUserProfile className='card m-2 p-2'>
            <Card>
                <Card.Header className="bg-dark text-light d-flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-bounding-box" viewBox="0 0 16 16">
                        <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    </svg>
                    <Span style={{ marginLeft: 10 }}>0{phone_number}</Span>
                </Card.Header>
                <Card.Body>
                    <Span className='d-block'>Balance</Span>
                    <Span className='d-block fw-bold'>KES 0.15</Span>
                    <hr/>

                    {userProfileLinks.map(UserProfileLinkElements)}
                    
                </Card.Body>
            </Card>
          
        </StyleUserProfile>
    )
}

const StyleFilterBtn = styled.div`
    button {
        width: 92px;
        margin: 2px;
    }
    button[type=search] {
        display: none;
    }
`

const StyleSearch = styled.div`
    margin-right: 10px;
    button {
        width: 162px;        
    }
`

const StyleHeaderNav = styled.div`
    h5 {
     cursor: pointer;   
    }
    .active-h5 {
        border-bottom: 3px solid gray;
    }
    h5:last-child {
        margin-left: 12px;
    }
`
const HistoryFilter = () => {
    return (
        <div className='history-header mb-3 card m-2 p-2'>
            <div>
                <StyleHeaderNav className='d-flex p-2'>
                    <h5 className="fw-bold active-h5 p-3">Sports Bets</h5>
                    <h5 className='jackpot p-3'>Jackpot</h5>
                </StyleHeaderNav>          
            </div>
            <Row className='d-flex p-2 '>
            <Col sm="12" md="9" lg="9">
                <StyleFilterBtn className="d-flex ">
                    <button className='btn btn-outline-secondary active'>
                        All
                    </button>
                    <button className='btn btn-outline-secondary'>
                        Settled
                    </button>
                    <button className='btn btn-outline-secondary'>
                        Unsettled
                    </button>
                </StyleFilterBtn>               
            </Col>
            <Col sm="12" md="3" lg="3">
                <StyleSearch >
                    <button 
                    type="search" 
                    className='btn btn-outline-secondary d-flex justify-content-between float-end'
                    >
                        <span>All Dates </span>    
                        <i className="bi bi-caret-down"></i>                 
                    </button>
                    
                </StyleSearch>                
            </Col>              
            </Row>           
        </div>
    )
}

const NoBetslipHistory = () => {
    return (
        <>
        <div className="text-center mt-5">
            <Span>You do not have any sportsbook bets</Span>
        </div>
        </>
    )
}