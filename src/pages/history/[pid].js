import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Row  from 'react-bootstrap/Row';
import Col  from 'react-bootstrap/Col';
import { UserProfile } from '../history';
import { useGetBetSessionFixturesQuery } from '../../hooks/history';
import Spinner from 'react-bootstrap/Spinner';
import Link from 'next/link';
import axios from '../../lib/axios';
import styled from 'styled-components';

const StyleHistory = styled.div`
    height: 100vh;
    overflow-y: scroll;
    overflow-x: hidden;
`
const History = () => {
    const [userId, setUserId] = useState(null)
    const FixturesComponent = () => {
        const router = useRouter();

        const { pid } = router.query
    
        const {data, isLoading, error } = useGetBetSessionFixturesQuery({userId, pid})

        if(error) {
            return <span>Error...</span>
        }
        if(isLoading) {
            return <div className='d-flex justify-content-center mt-5'><Spinner animation='grow' size="lg"/></div>
        }
        const FixtureElement = (name, i) => {
        
            return (
                <React.Fragment key={i}>
                    <div className='d-flex'>
                        <span className='fw-bold' style={{ marginRight: 25 }}>{i+1}.</span>
                        <div className='w-100'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <span className='d-block'><small className='fw-bold text-secondary'>Game:</small> {name.betslip_teams}</span>
                                <small className='text-secondary'>Active</small>
                            </div>
                            <div className='d-flex justify-content-between mt-2'>
                                <div className='d-flex align-items-center'>
                                    <small className='fw-bold text-secondary'>Market: </small>
                                    <span className='d-block'> { name.betslip_market}</span>
                                </div>
                                <div className='d-flex align-items-center mt-2'>
                                    <small className='fw-bold text-secondary'>Odds: </small>
                                    <span className='d-block'>{name.betslip_odds}</span>    
                                </div>
                            </div>
                            <div className='d-flex justify-content-between mt-2'> 
                                <div className='d-flex align-items-center'>
                                    <small className='fw-bold text-secondary'>Picked: </small>
                                    <span className='d-block'>{name.betslip_picked}</span>
                                </div>
                                <div className='d-flex align-items-center'>
                                    <small className='fw-bold text-secondary'>Result: </small>
                                    <span className='d-block'></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr/>         
                </React.Fragment>
            )
        }

        const removeBetslip = async (session_id) => {
            if(userId) {
                const res = await axios.delete(`api/users/betslips/delete?user_id=${userId}&session_id=${session_id}`)
                if(res.data.data === 1) {
                    router.push('/history?his_tab=sbets&tab=all')
                }
            }
        }   

        const TicketContainerElement = (link, i) => {
            const date = new Date(link.created_at)
            return (
                <React.Fragment key={i}>
                    <span className='fw-bold mb-2 d-block'>Ticket ID: {pid}</span>
                    <small className='d-block text-secondary'>
                        Placed at: 
                        {date.getDate()}/
                        {date.getMonth()}/
                        {date.getFullYear()}{ ' '}                     
                        {date.getHours()}:
                        {date.getMinutes()}
                    </small>
                    <div className='bg-danger text-light p-2 mt-2 mb-2 d-flex justify-content-between rounded shadow-sm'>
                        {data.fixtures.length > 1 ? <span className='fw-bold'>Multi Bet</span> : <span className='fw-bold'>Single Bet</span>}
                        <span className='fw-bold'>{link.betslip_status}</span>
                    </div>
                    <div className='d-sm-flex justify-content-between mt-4'> 
                        <div>
                            <small className='text-secondary'>Total Stake: </small>
                            <span>KES {link.stake_amount}</span>
                        </div>  
                        <div>
                            <small className='text-secondary'>Total Odds: </small>
                            <span>{link.total_odds}</span>
                        </div>                      
                        <div>
                            <small className='text-secondary'>Total Return: </small>
                            <span className='fw-bold text-danger'>KES {link.final_payout.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>                              
                    </div> 
                </React.Fragment>
            )
        }
        return (
            <>
                    <div  className="card p-4 mt-2 shadow-sm">
                        <div className="p-2 d-flex justify-content-between align-items-center">
                        <Link href="/history?his_tab=sbets&tab=all">
                            <a
                                itemProp="url"
                                className='text-decoration-none text-dark'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-arrow-left-circle text-dark fw-bold" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                                </svg>
                            <span style={{ marginLeft: 20 }}>Back</span> 
                            </a>
                        </Link>
                        <div className='btn btn-danger shadow-sm' onClick={() => removeBetslip(pid)}>
                            <i className="bi bi-trash" ></i>
                        </div>  
                        </div>
                        <div className='p-3'>
                            {data.cart.map(TicketContainerElement)}                           
                        </div>
                    </div>
                    <div className='card mt-2 p-4 shadow-sm'>
                        {data.fixtures.map(FixtureElement)}
                        <span>Number of Teams: <b className='fw-bold'>{data.fixtures.length}</b></span>
                    </div>
                   
            </>
        )
    }

    useEffect(() => {
        const userId = localStorage.getItem('u_i')
        setUserId(userId)
    }, [])

    return (
        <StyleHistory>
            <Row>
                <Col lg="3" md="3" sm="4">
                    <UserProfile/>
                </Col>
                <Col lg="6" md="8" sm="8">
                    <FixturesComponent/>
                </Col>
                <Col lg="3" md="12" sm="12">
                    <SideAdvert/>
                </Col>
            </Row>
        </StyleHistory>
    )
}

const SideAdvert = () => {
    return (
        <div className='card shadow-sm mt-2 p-3 bg-danger text-center border-0'>
            <h1 className='text-light'>BET360</h1>
        </div>
    )
}
 
export default History;