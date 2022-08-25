import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';
import { Span } from '../components/Html';
import useAuth from '../hooks/auth';
import axios from '../lib/axios';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import {useGetBalanceByUserIdQuery} from '../hooks/balance';
import { useRouter } from 'next/router';
import { useGetAllBetHistoryQuery } from '../hooks/betslip';
import { useGetAuthUserQuery } from '../hooks/customAuth';
import {    useGetAllUserHistoryBetslipV1Query, 
            useGetMegaJackpotHistoryQuery, 
            useGetPaginatedHistoryQuery, 
            useGetSettledHistoryBetslipQuery, 
            useGetUnsettledHistoryBetslipQuery, 
            useRemoveSingleHistoryBetslipQuery 
        } from '../hooks/history';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import Support from '../components/Support';
import withSession from '../lib/session';

const StyledHistory = styled.div`
    height: 100vh;
    overflow: scroll;
    .history-header {
        padding-top: 20px;
    }
`

export default function History(){
    const router = useRouter()
    
    // const fetchUser = async () => {
    //     const user = await axios.get('api/user')
 
    //     if(Boolean(user.data.id) === false) {
    //         router.push('/')
    //     }
    // }
    useEffect(() => {
        // fetchUser()
    }, [])
    return (
        <>
            <SportBetsHistoryProfile/>
        </>
    )
}

const SportBetsHistoryProfile = () => {
    
    const router = useRouter()
    const { tab , his_tab} = router.query
    const { user } = useAuth({ middleware: 'guest' })

    return (
        <StyledHistory>
            <Row>
                <Col lg="3" md="3" sm="4">
                    <UserProfile />
                </Col>
                <Col lg="9" md="9" sm="8">
                    <HistoryFilter /> 
                    <hr/>    
                    {tab === 'all' && <AllTabHistory user_id={user?.data.id}/>}
                    {tab === 'settled' && <SettledHistory user_id={user?.data.id}/>}
                    {tab === 'unsettled' && <UnsettledHistory user_id={user?.data.id}/>}
                    {tab === 'search' && <SearchFilterResults user_id={user?.data.id}/>}
                    {his_tab === 'jbets' && <JackpotHistory/>} 
                </Col>
            </Row>    
            <Support/>       
        </StyledHistory>
    )
}

const JackpotHistory = () => {
    const { user } = useAuth({ middleware: 'guest' })
    const { data, isLoading, error } = useGetMegaJackpotHistoryQuery(user.data.id)
    
    if(isLoading) {
        return <Spinner animation='grow' />
    }

    if(error) {
        return <span>Error</span>
    }
 
    const JackpotElements = (n, i) => {
        const jData = JSON.parse(n.jp_picked)
       
        return (
            <Card key={i} className="mb-3">
                <Card.Header>Mega Jackpot</Card.Header>
                {jData.map((d,i) => {
                    const el =JSON.parse(d)
          
                    return (
                        <>
                            <Card.Body>
                                <span className='d-block'>Teams: {el.home} - {el.away}</span>
                                <div className='d-flex justify-content-between'>
                                    <span>Picked: {el.picked}</span>
                                    <span>Outcome: pending</span>
                                </div>
                            </Card.Body>
                            <hr/>
                        </>
                    )
                })}
            </Card>
        )
    }
    return (
        <>
          {data.map(JackpotElements)}
        </>
        )
}


const Pagination = (data) => {

    const PaginationItems = (name, i) => {
        return (
           <React.Fragment key={i}>
               {name.label === 'pagination.previous' 
                && <li className={`page-item ${name.active && 'active'} ${(name.label === 'pagination.previous' && name.url === null) && 'disabled'}`}>
                <a className="page-link" href="#" tabIndex="-1">Previous</a>
                </li>}
                {(name.label  !== 'pagination.next' && name.label !== 'pagination.previous') && 
                <li className={`page-item ${name.active && 'active'}`}><a className="page-link" href="#">{name.label}</a></li>
                }
                {name.label === 'pagination.next' 
                && <li className={`page-item ${name.active && 'active'} ${(name.label === 'pagination.next' && name.url === null) && 'disabled'}`}>
                <a className="page-link" href="#" tabIndex="-1">Next</a>
                </li>}
              
           </React.Fragment>
        )
    }
    return (
          <>
           <nav aria-label="History page navigation" >
            <ul className="pagination d-flex justify-content-center" >
                {data.data.links.map(PaginationItems)}
                </ul>
           </nav>            
          </>
    )
}

const AllTabHistory = ({ user_id }) => {

    const { data, error, isLoading, refetch } = useGetAllUserHistoryBetslipV1Query(user_id)
 
    if(error) {
        return <span className='d-flex justify-content-center mt-5 text-danger fw-bold'>Error</span>
    }

    if(isLoading) {
        return  <div className='d-flex justify-content-center'>
        <Spinner className='mt-5' animation="grow" size="lg"/>
    </div>
    }
 
    const openMoreMarkets = (i) => {
        const elements = document.getElementsByClassName('history-more-markets')[i];
        
        if( elements.style.display === 'none') {
            elements.style.display = 'block'
        } else {
            elements.style.display = 'none'
        }
    }

    const BetHistoryElements = (name, i) => {
        const historyData = JSON.parse(name.cart)
   
        return (
            <React.Fragment key={i}>         
                    <div 
                    className="p-3 m-1 shadow rounded" 
                    style={{ 
                        borderBottomRightRadius: 0, 
                        borderBottomLeftRadius: 0,
                        borderBottom: 'none', 
                        cursor: 'pointer',
                        borderTop: '1px solid lightgray'
                    }}
                    onClick={() => openMoreMarkets(i)}
                    >
                    <div className='d-flex justify-content-between'>
                        <div>
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
                                          
                    </div>
                    <div>
                        <small>Bet ID:</small>
                        <small>{name.cart_id}</small>
                    </div>
                    <div 
                    className="mt-2 d-flex align-items-center justify-content-between bg-success p-2 rounded text-light"
                    >   
                        <span>Bet Status</span> 
                        <Span className='text-warning'>{name.bet_status}</Span>
                    </div>
                    <div className='d-sm-flex justify-content-between mt-2 p-1'>
                        <div>
                            <Span>Stake Amount: </Span>
                            <Span className="fw-bold">KES {name.bet_amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Span>
                        </div>
                        <div>
                            <Span>Final Payout: </Span>
                            <Span className="fw-bold">KES {name.possible_payout.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Span>
                        </div>  
                    </div>                               
                    </div>
                    <div 
                    className={`card p-3 mb-2 history-more-markets`}
                    style={{ 
                        borderTopRightRadius: 0, 
                        borderTopLeftRadius: 0, 
                        borderTop: 'none',
                        display:'none' 
                    }}
                    >
                    {historyData.map((d,i) => {       
                        return (
                            <div className='card p-3 mb-2 shadow '>
                                <div>
                                    <small>Game ID: {d.fixture_id}</small>
                                    <span className='d-block text-center bg-success rounded text-light p-1 m-1'>{d.betslip_teams}</span>
                                </div>                        
                                <div className='d-flex justify-content-between'>
                                    <span>Market: {d.betslip_market}</span>
                                    <span>Odds: {d.betslip_odds}</span>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <span>Picked: {d.betslip_picked}</span>
                                </div>
                            </div>
                        )
                    })}
                    </div>
            </React.Fragment>
        )
    }
 
    return (
        <div className='bg-light rounded p-2'>
        <div className='d-flex justify-content-center m-2'>
            <button 
                className='btn btn-outline-success border-0 shadow d-flex align-items-center'
                onClick={refetch}
            >
                Refresh
                <FontAwesomeIcon
                    icon={faRefresh}
                    style={{ marginLeft: 5 }}
                />
            </button>
        </div>
         
         {data?.data.length > 0 ?
         data.data.map(BetHistoryElements) : 
          <NoBetslipHistory/>}  

          {data?.data.length >= 5 && <Pagination data={data}/>} 
        </div>
    )
}

const SettledHistory = ({ user_id }) => {
 
    const { data, error, isLoading } = useGetSettledHistoryBetslipQuery(user_id)

    if(error) {
        return <span className='d-flex justify-content-center mt-5 text-danger fw-bold'>Error</span>
    }
    if(isLoading) {
        return <div className='d-flex justify-content-center'>
        <Spinner className='mt-5' animation="grow" size="lg"/>
    </div>
    }

    const SettledItems = (name , i) => {
        const historyData = JSON.parse(name.cart)
                return (
                    <React.Fragment key={i}>
                        <div 
                        className="card p-3 mt-1 cursor-pointer" 
                        style={{ borderBottomRightRadius: 0, borderBottomLeftRadius: 0, borderBottom: 'none' }}
                        onClick={() => openMoreMarkets(i)}
                        >
                            <div className="card p-3 m-2">
                            <div className='d-flex justify-content-between'>
                                <div>
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
                           
                            </div>
                            <div>
                                <small>Bet ID:</small>
                                <small>{name.card_id}</small> 
                            </div>
                            <div 
                            className="mt-2 d-flex align-items-center justify-content-between bg-success p-2 rounded text-light"
                            >   
                                <span>Bet Status</span>
                                <Span className="text-white fw-bold">{name.bet_status}</Span>
                            </div>
                            <div className='d-sm-flex justify-content-between mt-2 p-1'>
                                <div>
                                    <Span>Stake Amount: </Span>
                                    <Span className="fw-bold">KES {name.bet_amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Span>
                                </div>
                                <div>
                                    <Span>Final Payout: </Span>
                                    <Span className="fw-bold">KES {name.possible_payout.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Span>
                                </div>  
                            </div>
                                       
                        </div>
                        </div>
                        <div 
                        className={`card p-3 mb-2 history-more-markets`}
                        style={{ 
                            borderTopRightRadius: 0, 
                            borderTopLeftRadius: 0, 
                            borderTop: 'none',
                            display:'none' 
                        }}
                        >
                    {historyData.map((d,i) => {       
                        return (
                            <div className='card p-3 mb-2 shadow ' key={i+d.fixture_id}>
                                <div>
                                    <small>Game ID: {d.fixture_id}</small>
                                    <span className='d-block text-center bg-success rounded text-light p-1 m-1'>{d.betslip_teams}</span>
                                </div>                        
                                <div className='d-flex justify-content-between'>
                                    <span>Market: {d.betslip_market}</span>
                                    <span>Odds: {d.betslip_odds}</span>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <span>Picked: {d.betslip_picked}</span>
                                </div>
                            </div>
                        )
                    })}
                    </div>
                    </React.Fragment>
                )
            }
    
    return (
        <>
        {data.data.length > 0 ? 
        data.data.map(SettledItems) : 
        <NoBetslipHistory/>}

        {data?.data.length >= 5 && <Pagination data={data}/>} 
        </>
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
                    className="mt-2 d-flex align-items-center justify-content-between bg-success p-2 rounded text-light"
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

const UnsettledHistory = ({ user_id }) => {
    const { data, error, isLoading, refetch } = useGetUnsettledHistoryBetslipQuery(user_id)

    if(error) {
        return <span className='d-flex justify-content-center mt-5 text-danger fw-bold'>Error</span>
    }

    if(isLoading) {
        return <div className='d-flex justify-content-center'>
                    <Spinner className='mt-5' animation="grow" size="lg"/>
                </div>
    }
    const openMoreMarkets = (i) => {
        const elements = document.getElementsByClassName('history-more-markets-unsettled')[i];
        
        if( elements.style.display === 'none') {
            elements.style.display = 'block'
        } else {
            elements.style.display = 'none'
        }
    }
    const UnsettledItems = (name, i) => {
        const historyData = JSON.parse(name.cart)
        return (
            <React.Fragment key={i} >
                <div 
                    className="card p-3 mt-1 cursor-pointer " 
                    style={{ borderBottomRightRadius: 0, borderBottomLeftRadius: 0, borderBottom: 'none' }}
                    onClick={() => openMoreMarkets(i)}
                    >
                        <div className=" cursor-pointer">
                            <div className='d-flex d-flex justify-content-between'>
                                <div>
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
                        
                            </div>
                            <div>
                                <small>Bet ID:</small>
                                <small>{name.cart_id}</small>
                            </div>
                            <div 
                            className="mt-2 d-flex align-items-center justify-content-between bg-success p-2 rounded text-light"
                            >   
                            <span>Bet Status</span>
                                {/* {name.fixtures.length > 1 ? <span>Multi Bet</span> : <span>Single Bet</span>} */}
                                <Span className="text-warning">{name.bet_status}</Span>
                            </div>
                            <div className='d-sm-flex justify-content-between mt-2 p-1'>
                                <div>
                                    <Span>Stake Amount: </Span>
                                    <Span className="fw-bold">KES {name.bet_amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Span>
                                </div>
                                <div>
                                    <Span>Final Payout: </Span>
                                    <Span className="fw-bold">KES {name.possible_payout.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Span>
                                </div>  
                            </div>                                    
                        </div>
                </div>
                <div 
                    className={`card p-3 mb-2 history-more-markets-unsettled`}
                    style={{ 
                        borderTopRightRadius: 0, 
                        borderTopLeftRadius: 0, 
                        borderTop: 'none',
                        display:'none' 
                    }}
                    >
                    {historyData.map((d,i) => {       
                        return (
                            <div className='card p-3 mb-2 shadow ' key={i+d.fixture_id}>
                                <div>
                                    <small>Game ID: {d.fixture_id}</small>
                                    <span className='d-block text-center bg-success rounded text-light p-1 m-1'>{d.betslip_teams}</span>
                                </div>                        
                                <div className='d-flex justify-content-between'>
                                    <span>Market: {d.betslip_market}</span>
                                    <span>Odds: {d.betslip_odds}</span>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <span>Picked: {d.betslip_picked}</span>
                                </div>
                            </div>
                        )
                    })}
                    </div>            
            </React.Fragment>
        )
    }
    return (
        <div className='bg-light rounded p-2'>
         <div className='d-flex justify-content-center m-2'>
            <button 
                className='btn btn-outline-success border-0 shadow d-flex align-items-center'
                onClick={refetch}
            >
                Refresh
                <FontAwesomeIcon
                    icon={faRefresh}
                    style={{ marginLeft: 5 }}
                />
            </button>
        </div>
            {data.data.length > 0 ? 
            data.data.map(UnsettledItems) :
            <NoBetslipHistory/>}
            
          {data?.data.length >= 5 && <Pagination data={data}/>} 
        </div>
    )
}

const StyleUserProfile = styled.div`
padding-top: 20px;
background-color : #ebeded;
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
        path: '/history?his_tab=sbets&tab=all'
    }
]
export const UserProfile = () => {

    const { user } = useAuth({ middleware: 'guest' })

const UserProfileLinkElements = (link, i) => {
        return (
            <Link key={i} href={link.path}>
                <a
                    itemProp='url'
                    className='d-flex justify-content-between text-decoration-none text-light d-block mb-3'
                    style={{ letterSpacing: '1px' }}
                >
                    {link.name}
                    <i className="bi bi-arrow-right-short"></i>
                </a>
            </Link>
        )
}

const BalanceElement = () => {

            const {data, error, isLoading} = useGetBalanceByUserIdQuery(user?.data.id)

            if(error) {
                return <span className="d-block fw-bold text-danger mt-1">Error</span>
            }
    
            if(isLoading) {
                return ''
            }
    
            const { amount } = data

            return (
                <Span className='d-block fw-bold text-light'  style={{ letterSpacing: '1px' }}>
                    <FontAwesomeIcon 
                    icon={faRefresh} 
                    style={{ 
                        cursor: 'pointer',
                        paddingRight: 4, 
                    }}
                    />
                    KES {amount?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </Span>
            )
    
        }

    const UserProfileElement = () => {
        return (
            <Span className='fw-bold' style={{ marginLeft: 10, letterSpacing: '1px' }} >+254{user?.data.phone_number}</Span>
        )
    }
       
    return (
        <StyleUserProfile className='card m-2 p-2 bg-success'>
            <Card className=' shadow text-light p-2 m-2' style={{ background: '#505050' }}>
                <Card.Header className="bg-light text-dark d-flex m-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-bounding-box" viewBox="0 0 16 16">
                        <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    </svg>
                    <UserProfileElement/>
                </Card.Header>
                <Card.Body>
                    <Span className='d-block text-light' style={{ letterSpacing: '1px' }}>Balance</Span>
                    <BalanceElement/>
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
    const { tab, his_tab } = router.query

    const openModal = () => {
        setIsModalOpen(prev => !prev)
    }

    const closeMenu = () => setIsModalOpen(false)

    const filterDate = (e) => {
        setDates(prev => ({...prev, [e.target.name]: e.target.value}))
    }
    return (
        <div className='history-header mb-3 card m-2 p-2 bg-success'>
            <div>
                <StyleHeaderNav className='d-flex p-2'>
                    <Link href="history?his_tab=sbets&tab=all">
                        <a
                            itemProp='url'
                            className='text-decoration-none text-light'
                        >
                            <h5 
                            className={`${his_tab === 'sbets' ? 'fw-bold active-h5' : ''}  p-3 text-light`}
                            >
                                Sports Bets
                            </h5>
                        </a>
                    </Link>
                    <Link href="history?his_tab=jbets&tab=j_all">
                        <a
                           itemProp='url'
                           className='text-decoration-none text-light'  
                        >
                            <h5 
                            className={`${his_tab === 'jbets' ? 'fw-bold active-h5' : ''}  p-3`}
                            >
                                Jackpot
                            </h5>
                        </a>
                    </Link>
                </StyleHeaderNav>          
            </div>
            <Row className='d-flex p-2 '>
            <Col sm="12" md="3" lg="3" className='mb-2'>
                <StyleFilterBtn className="d-sm-flex justify-content-between align-items-center">
                    <Link href="history?his_tab=sbets&tab=all">
                        <a 
                        itemProp="url" 
                        className={`btn btn-outline-warning shadow ${tab === 'all' && 'active'}`}
                        >
                            All
                        </a>
                    </Link>
                    <Link href="history?his_tab=sbets&tab=settled">
                        <a 
                        itemProp='url' 
                        className={`btn btn-outline-warning shadow ${tab === 'settled' && 'active'}`}
                        style={{ marginLeft: 5 }}
                        >
                            Settled
                        </a>
                    </Link>
                    <Link href="history?his_tab=sbets&tab=unsettled">
                        <a 
                        itemProp='url' 
                        className={`btn btn-outline-warning shadow ${tab === 'unsettled' && 'active'}`}
                        style={{ marginLeft: 5 }}
                        >
                            Unsettled
                        </a>
                    </Link>                  
                </StyleFilterBtn>               
            </Col>
            <Col sm="12" md="9" lg="9" className='d-flex justify-content-end'>
                <StyleSearch >
                    <button 
                    type="search" 
                    className='btn btn-outline-light d-flex justify-content-between float-end'
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
    const router = useRouter()
    const { his_tab } = router.query
    return (
        <>
        <div className="text-center mt-5">
            <Span className='text-light'>
                You do not have any {his_tab === 'sbets' ? 'Sportsbook' : 'Jackpot'} bets
            </Span>
        </div>
        </>
    )
}

 
