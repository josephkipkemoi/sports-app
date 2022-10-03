import React, { useEffect, useRef, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';
import { Span } from '../components/Html';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import {useGetBalanceByUserIdQuery} from '../hooks/balance';
import { useRouter } from 'next/router';
import {    useGetAllUserHistoryBetslipV1Query, 
            useGetMegaJackpotHistoryQuery, 
            useGetSettledHistoryBetslipQuery, 
            useGetUnsettledHistoryBetslipQuery, 
        } from '../hooks/history';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import Support from '../components/Support';
import AuthUser from '../hooks/AuthUser';
import { withProtected } from '../hooks/RouteProtection';
import MobileNavComponent from '../components/MobileNavComponent';
import axios from '../lib/axios';
import HistoryComponent from '../components/HistoryComponent';

const StyledHistory = styled.div`
    height: 100vh;
    overflow: scroll;
    overflow-y: scroll;
    overflow-x: hidden;
    background-color: #ebeded;
    .history-header {
        padding-top: 20px;
    }
    .game-id {
        text-transform: uppercase;
    }
`

function History(){
    return (
        <>
            <SportBetsHistoryProfile/>
            <MobileNavComponent/>
        </>
    )
}

const SportBetsHistoryProfile = () => {

    const router = useRouter()
    const { tab , his_tab} = router.query
    const { uu_id } = AuthUser()

    return (
        <>
            <Row className='flex-column-reverse'>
                <Col lg="3" md="3" sm="4">
                    <UserProfile />
                </Col>
                <Col lg="9" md="9" sm="8">
                    <StyledHistory>
                        <HistoryFilter  /> 
                        {tab === 'all' && <AllTabHistory user_id={uu_id.id}/>}
                        {tab === 'settled' && <SettledHistory user_id={uu_id.id}/>}
                        {tab === 'unsettled' && <UnsettledHistory user_id={uu_id.id}/>}
                        {tab === 'search' && <SearchFilterResults user_id={uu_id.id}/>}
                        {(his_tab === 'jbets' && tab === 'j_all') && <AllJackpotHistory user_id={uu_id.id}/>} 
                        {(his_tab === 'jbets' && tab === 'mega_jackpot') && <MegaJackpotHistory user_id={uu_id.id}/>} 
                        {(his_tab === 'jbets' && tab === 'five_jackpot') && <FiveJackpotHistory user_id={uu_id.id}/>} 
                    </StyledHistory>                   
                </Col>
            </Row>    
            <Support/>       
        </>
    )
}

const AllJackpotHistory = ({ user_id }) => {

    const [pageNumber, setPageNumber] = useState(1)
    const { data, isLoading, error, refetch } = useGetMegaJackpotHistoryQuery({user: user_id, market: 'All'})

    if(isLoading) {
        return <Spinner animation='grow' />
    }

    if(error) {
        return <span>Error</span>
    }

    return (
        <>
           <HistoryComponent 
                data={data}
                setPageNumber={setPageNumber} 
                pageNumber={pageNumber}
                refetch={refetch}
                user_id={user_id}
            />   
       </>
    )
}

const MegaJackpotHistory = ({ user_id }) => {

    const [pageNumber, setPageNumber] = useState(1)
    const { data, isLoading, error, refetch } = useGetMegaJackpotHistoryQuery({user: user_id, market: 'Mega Jackpot'})
 
    if(isLoading) {
        return <Spinner animation='grow' />
    }

    if(error) {
        return <span>Error</span>
    }

    return (
        <>
            <HistoryComponent 
                data={data}
                setPageNumber={setPageNumber} 
                pageNumber={pageNumber}
                refetch={refetch}
                user_id={user_id}
            /> 
       </> 
    )
}

const FiveJackpotHistory = ({ user_id }) => {

    const [pageNumber, setPageNumber] = useState(1)
    const { data, isLoading, error, refetch } = useGetMegaJackpotHistoryQuery({user: user_id, market: 'Five Jackpot'})
 
    if(isLoading) {
        return <Spinner animation='grow' />
    }

    if(error) {
        return <span>Error</span>
    }
 
    return (
        <HistoryComponent 
            data={data}
            setPageNumber={setPageNumber} 
            pageNumber={pageNumber}
            refetch={refetch}
            user_id={user_id}
        /> 
    )
}

const AllTabHistory = ({ user_id }) => {

    const [pageNumber, setPageNumber] = useState(1)
    const { data, error, isLoading, refetch } = useGetAllUserHistoryBetslipV1Query({user_id, pageNumber})
   
    if(error) {
        return <span className='d-flex justify-content-center mt-5 text-danger fw-bold'>Error</span>
    }

    if(isLoading) {
        return  <div className='d-flex justify-content-center'>
                    <Spinner className='mt-5' animation="grow" size="lg"/>
                </div>
    }
 
    return (   
            <HistoryComponent 
                data={data}
                setPageNumber={setPageNumber} 
                pageNumber={pageNumber}
                refetch={refetch}
                user_id={user_id}
            />     
    )
}

const SettledHistory = ({ user_id }) => {
    const [pageNumber, setPageNumber] = useState(1)
    const { data, error, isLoading, refetch } = useGetSettledHistoryBetslipQuery({user_id, pageNumber})
    
    if(error) {
        return <span className='d-flex justify-content-center mt-5 text-danger fw-bold'>Error</span>
    }

    if(isLoading) {
        return  <div className='d-flex justify-content-center'>
                    <Spinner className='mt-5' animation="grow" size="lg"/>
                </div>
    }

    return (
        <HistoryComponent 
            data={data}
            setPageNumber={setPageNumber} 
            pageNumber={pageNumber}
            refetch={refetch}
            user_id={user_id}
        />  
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

    const [pageNumber, setPageNumber] = useState(1)
    const { data, error, isLoading, refetch } = useGetUnsettledHistoryBetslipQuery({user_id, pageNumber})

    if(error) {
        return <span className='d-flex justify-content-center mt-5 text-danger fw-bold'>Error</span>
    }

    if(isLoading) {
        return <div className='d-flex justify-content-center'>
                    <Spinner className='mt-5' animation="grow" size="lg"/>
                </div>
    }

    return (
           <HistoryComponent 
                data={data}
                setPageNumber={setPageNumber} 
                pageNumber={pageNumber}
                refetch={refetch}
                user_id={user_id}
            />  
    )
}

const StyleUserProfile = styled.div`
padding-top: 20px;
background-color : #ebeded;
border-radius: 0;
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

    const { uu_id } = AuthUser()

const UserProfileLinkElements = (link, i) => {
        return (
            <Link key={i} href={link.path}>
                <a
                    itemProp='url'
                    className='d-flex justify-content-between text-decoration-none text-dark d-block mb-3'
                    style={{ letterSpacing: '1px' }}
                >
                    {link.name}
                    <i className="bi bi-arrow-right-short"></i>
                </a>
            </Link>
        )
}

const BalanceElement = () => {
    if(uu_id) {
        const {data, error, isLoading} = useGetBalanceByUserIdQuery(uu_id.id)

        if(error) {
            return <span className="d-block fw-bold text-dark mt-1">Error</span>
        }

        if(isLoading) {
            return ''
        }

        const { amount } = data

        return (
            <Span className='d-block fw-bold text-dark'  style={{ letterSpacing: '1px' }}>
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
        }

    const UserProfileElement = () => {
        return (
            <Span className='fw-bold' style={{ marginLeft: 10, letterSpacing: '1px' }} >+254{uu_id.phone_number}</Span>
        )
    }
       
    return (
        <StyleUserProfile className='card p-2 bg-white border-0'>
            <Card className=' shadow text-light p-2 m-2 border-0' style={{ background: '#edebeb' }}>
                <Card.Header className="bg-light text-dark d-flex m-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-bounding-box" viewBox="0 0 16 16">
                        <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    </svg>
                    <UserProfileElement/>
                </Card.Header>
                <Card.Body>
                    <Span className='d-block text-dark' style={{ letterSpacing: '1px' }}>Balance</Span>
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
 
    button {
        width: 102px;        
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
    const positionRef = useRef(null)

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

    const SportBetsLinks = () => {
        return (
            <StyleFilterBtn className="d-sm-flex justify-content-between align-items-center">
                <Link 
                    href={`${his_tab === 'sbets' ? 'history?his_tab=sbets&tab=all' : 'history?his_tab=jbets&tab=j_all'}`}
                >
                    <a 
                    itemProp="url" 
                    className={`btn btn-primary shadow ${tab === 'all' || tab === 'j_all' && 'active'}`}
                    ref={positionRef}
                    >
                        All
                    </a>
                </Link>
                <Link 
                    href={`${his_tab === 'sbets' ? 'history?his_tab=sbets&tab=settled' : 'history?his_tab=jbets&tab=mega_jackpot'} `}
                >
                    <a 
                    itemProp='url' 
                    className={`btn btn-primary shadow ${tab === 'settled' || tab === 'mega_jackpot' && 'active'}`}
                    style={{ marginLeft: 5 }}
                    >
                        {his_tab === 'sbets' ? "Settled" : "Mega Jackpot"}
                    </a>
                </Link>
                <Link 
                    href={`${his_tab === 'sbets' ? 'history?his_tab=sbets&tab=unsettled' : 'history?his_tab=jbets&tab=five_jackpot' }`}
                >
                    <a 
                    itemProp='url' 
                    className={`btn btn-primary shadow ${tab === 'unsettled' || tab === 'five_jackpot' && 'active'}`}
                    style={{ marginLeft: 5 }}
                    >
                        {his_tab === 'sbets' ? "Unsettled" : "Five Jackpot"}
                    </a>
                </Link>                  
            </StyleFilterBtn>  
        )
    }


    useEffect(() => {
        positionRef.current.focus()
    }, [])

    return (
        <div className='history-header card p-2 shadow-sm border-0' style={{ backgroundColor: '#edebeb' }}>
            <div>
                <StyleHeaderNav className='d-flex mb-2'>
                    <Link href="history?his_tab=sbets&tab=all">
                        <a
                            itemProp='url'
                            className='text-decoration-none text-dark'
                        >
                            <h5 
                            className={`${his_tab === 'sbets' ? 'fw-bold active-h5' : ''}  p-3 text-dark`}
                            >
                                Sports Bets
                            </h5>
                        </a>
                    </Link>
                    <Link href="history?his_tab=jbets&tab=j_all">
                        <a
                           itemProp='url'
                           className='text-decoration-none text-dark'  
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
            <div className='d-flex justify-content-between'>
            <div>
                <SportBetsLinks />          
            </div>
            <div className='d-flex justify-content-end'>
                <StyleSearch >
                    <button 
                        type="search" 
                        className='btn btn-primary shadow d-flex justify-content-between float-end'
                        onClick={openModal}
                    >
                        <span>All Dates </span>    
                        <i className="bi bi-caret-down"></i>                 
                    </button>                    
                </StyleSearch>                
            </div>              
            </div>     
            <Modal show={isModalOpen} className="mt-5 pt-5 " modalId="modal-ref">
                <Modal.Body modalId="modal-ref" className="p-4 rounded" style={{ background: '#e4e4e4' }}>
                    <div className='d-flex justify-content-end'>
                        <h3 style={{ cursor: 'pointer' }}  onClick={closeMenu}>X</h3>
                    </div>
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
                        <div className='d-flex justify-content-center mt-3'>
                            <div style={{ marginRight: 8 }}>
                                <button className='btn btn-danger w-100' onClick={closeMenu}>Cancel</button>
                            </div>
                            <div>
                                <Link href={`history?tab=search&from=${from_date}&to=${to_date}`}>
                                    <a 
                                        itemProp='url'
                                    >
                                        <button className="btn btn-warning w-100">Search</button>
                                    </a>
                                </Link>
                            </div>                            
                        </div>
                       
                    </Row>
                                
                </Modal.Body>                            
            </Modal>      
        </div>
    )
}

export default withProtected(History);
