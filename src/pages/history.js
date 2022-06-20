import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';
import { Span } from '../components/Html';
import useAuth from '../hooks/auth';
import axios from '../lib/axios';
import { Card } from 'react-bootstrap';
import Link from 'next/link';
import {useGetBalanceByUserIdQuery} from '../hooks/balance';
import { useRouter } from 'next/router';
import { useGetAllBetHistoryQuery } from '../hooks/betslip';

const StyledHistory = styled.div`
    background-color: #ebeded;
    height: 100vh;
    overflow: scroll;
    .history-header {
        padding-top: 20px;
    }
`

export default function History(){

    return (
        <>
            <HistoryProfile/>
        </>
    )
}
function HistoryProfile() { 
    const [history, setHistory] = useState([])
    const [unsettledHistory, setUnsettledHistory] = useState([])
    const [settledHistory, setSettledHistory] = useState([])

    const { user } = useAuth();
    const router = useRouter()
    const { tab } = router.query
 
    const { data } = useGetBalanceByUserIdQuery(user && user.id)
 
    const fetchBetHistory = async () => {
        if(!!user) {
            const response = await axios.get(`api/users/${user.id}/betslips`)
 
            setHistory(response?.data?.data)
        }
    }

    const fetchActiveHistory = async () => {
    
        if(!!user) {
            const response = await axios
                                    .get(`api/users/betslips/status?user_id=${user.id}&bet_status=Active`)
            setUnsettledHistory(response?.data?.data)
        }
    }

    const fetchSettledHistory = async () => {
        if(!!user) {
            const response = await axios
                                    .get(`api/users/betslips/status?user_id=${user.id}&bet_status=Lost`)
            setSettledHistory(response?.data?.data)
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
                <div className="card p-3 m-2 cursor-pointer">
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
             
            </React.Fragment>
        )
    }

    useEffect(() => {
        fetchBetHistory()
        fetchActiveHistory()
        fetchSettledHistory()
    },[user, tab])

    return (
        <StyledHistory>
            <Row>
                <Col lg="3" md="3" sm="4">
                    <UserProfile user={user} balance={data?.amount}/>
                    <UpdateHistory/>
                </Col>
                <Col lg="9" md="9" sm="8">
                    <HistoryFilter/> 
                    <hr/>    
                    {(tab === 'all' && history.length === 0) && <NoBetslipHistory/>}  
                    {(tab === 'all' && !!history.length) && history.map(BetHistoryElements)}  
                    {(tab === 'settled' && settledHistory?.data?.length === 0) && <NoBetslipHistory/>}     
                    {(tab === 'settled' && !!settledHistory?.data?.length) && <SettledHistory data={settledHistory?.data}/>}
                    {(tab === 'unsettled' && unsettledHistory?.data?.length === 0) && <NoBetslipHistory/>}     
                    {(tab === 'unsettled' && !!unsettledHistory?.data?.length) && <UnsettledHistory data={unsettledHistory?.data}/>}
                    {tab === 'search' && <SearchFilterResults user_id={user?.id}/>}
                </Col>
            </Row>           
        </StyledHistory>
    )
}

const SearchFilterResults = ({ user_id }) => {
    const router = useRouter()
    const { from, to } = router.query;
    const [searchHistory, setSearchHistory] = useState([])

    const fetchSearch = async () => {
        const res = await axios.get(`api/users/betslips/search?user_id=${user_id}&from_date=${from}&to_date=${to}`);
        setSearchHistory(res?.data?.data)
    }

    const SearchHistoryItems = (name, i) => {
        return (
            <React.Fragment key={i}>
                 <div className="card p-3 m-2 cursor-pointer">
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
                    <span>Bet Status</span>
                        {/* {name.fixtures.length > 1 ? <span>Multi Bet</span> : <span>Single Bet</span>} */}
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
            </React.Fragment>
        )
    }

    useEffect(() => {
        fetchSearch()
    }, [from , to])
    return (
        <>
           {searchHistory?.data?.length === 0 ? <span>No results</span> : searchHistory?.data?.map(SearchHistoryItems) }
        </>     
    )
}

const SettledHistory = ({ data }) => {

    const SettledItems = (name , i) => {
        return (
            <React.Fragment key={i}>
                <div className="card p-3 m-2 cursor-pointer">
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
                    <span>Bet Status</span>
                        {/* {name.fixtures.length > 1 ? <span>Multi Bet</span> : <span>Single Bet</span>} */}
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
            </React.Fragment>
        )
    }
    return (
        <>
        {data.map(SettledItems)}
        </>
    )
}

const UnsettledHistory = ({ data }) => {
    const UnsettledItems = (name, i) => {
        return (
            <React.Fragment key={i}>
                <div className="card p-3 m-2 cursor-pointer">
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
                    <span>Bet Status</span>
                        {/* {name.fixtures.length > 1 ? <span>Multi Bet</span> : <span>Single Bet</span>} */}
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
            </React.Fragment>
        )
    }
    return (
        <>
          {data.map(UnsettledItems)}
        </>
    )
}

const StyleUserProfile = styled.div`
padding-top: 20px;
`

const userProfileLinks = [
    {
        name: 'Transactions',
        path: '/transactions'
    },
    {
        name: 'Deposit',
        path: '/deposits'
    },
    {
        name: 'Withdraw',
        path: '/withdrawals'
    },
    {
        name: 'Bet History',
        path: '/history?tab=all'
    }
]
const UserProfile = ({ user, balance }) => {

    const UserProfileLinkElements = (link, i) => {
        return (
            <Link key={i} href={link.path}>
                <a
                    itemProp='url'
                    className='d-flex justify-content-between text-decoration-none text-dark d-block mb-3'
                >
                    {link.name}
                    <i className="bi bi-arrow-right-short"></i>
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
                    <Span style={{ marginLeft: 10 }}>0{user?.phone_number}</Span>
                </Card.Header>
                <Card.Body>
                    <Span className='d-block'>Balance</Span>
                    <Span className='d-block fw-bold'>KES {balance?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Span>
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
    const router = useRouter()
    const [dates, setDates] = useState({
        from_date: '',
        to_date: ''
    });
    const { from_date, to_date } = dates;
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { tab } = router.query
    
    const openModal = () => {
        setIsModalOpen(prev => !prev)
    }

    const closeMenu = () => setIsModalOpen(false)

    const filterDate = (e) => {
        setDates(prev => ({...prev, [e.target.name]: e.target.value}))
    }
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
                    <Link href="history?tab=all">
                        <a itemProp="url">
 
                            <button className={`btn btn-outline-secondary ${tab === 'all' && 'active'}`}>
                                All
                            </button>
                        </a>
                    </Link>
                    <Link href="history?tab=settled">
                        <a itemProp='url'>
                            <button className={`btn btn-outline-secondary ${tab === 'settled' && 'active'}`}>
                                Settled
                            </button>
                        </a>
                    </Link>
                    <Link href="history?tab=unsettled">
                        <a itemProp='url'>
                            <button className={`btn btn-outline-secondary ${tab === 'unsettled' && 'active'}`}>
                                Unsettled
                            </button>
                        </a>
                    </Link>                   
                    
                </StyleFilterBtn>               
            </Col>
            <Col sm="12" md="3" lg="3">
                <StyleSearch >
                    <button 
                    type="search" 
                    className='btn btn-outline-secondary d-flex justify-content-between float-end'
                    onClick={openModal}
                    >
                        <span>All Dates </span>    
                        <i className="bi bi-caret-down"></i>                 
                    </button>
                    
                </StyleSearch>                
            </Col>              
            </Row>     
            <Modal show={isModalOpen} className="mt-5 pt-5" modalId="modal-ref">
                <Modal.Body modalId="modal-ref" className="p-4" style={{ background: '#e4e4e4' }}>
                    <h3 onClick={closeMenu}>X</h3>
                    <Row>
                        <Col>
                            <label htmlFor="filterDate">From</label>
                            <input 
                            id="filterDate" 
                            className='form-control' 
                            type="date" 
                            name="from_date"
                            onChange={filterDate}
                            />  
                        </Col>
                        <Col>
                            <label htmlFor="filterDate">To</label>
                            <input 
                            id="filterDate" 
                            className='form-control' 
                            type="date" 
                            name="to_date"
                            onChange={filterDate}
                            />  
                        </Col>
                        <Link href={`history?tab=search&from=${from_date}&to=${to_date}`}>
                            <a 
                                itemProp='url'
                            >
                                <button className="btn btn-warning mt-3">Search</button>
                            </a>
                        </Link>
                    </Row>
                                
                </Modal.Body>                            
            </Modal>      
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

const UpdateHistory = () => {
    const { user } = useAuth({ middleware: 'guest' })
    const user_id = user && user.id
    const updateLost = async () => {
      await axios.patch(`api/users/betslips/update?user_id=${user_id}&session_id=1655669961037`)
     
    }
    return (
        <>
            <button onClick={updateLost}>Lost</button>
        </>
    )
}