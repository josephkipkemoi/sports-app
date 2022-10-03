import React, { useState } from "react";
import { useRouter } from 'next/router';
import axios from '../lib/axios';

import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import { faTrash, faSoccerBall } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AlertModalElement, RefreshButtonElement } from '../components/HtmlElements';
import Pagination from "./Pagination";
import { Span } from '../components/Html';


export default function HistoryComponent ({ data, setPageNumber, pageNumber, refetch, user_id }) {
    
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [cartId, setCartId] = useState('');

    const closeModal = () => setIsModalOpen(false)

    const removeSingleBetHistory = async (cart_id) => {     
        const res = await axios.delete(`api/users/fixtures/carts/delete?user_id=${user_id}&cart_id=${cart_id}`)
        if(res.status === 200) {
            refetch()
            closeModal()
        }
    }

    const openMoreMarkets = (i,e) => {
        const elements = document.getElementsByClassName('history-more-markets')[i];

        if(Boolean(e.target.getAttribute('clickcart')) === true) {        
            if( elements.style.display === 'none') {
                elements.style.display = 'block'
            } else {
                elements.style.display = 'none'
            }
        }
  
    }

    const openDeleteModal = (cart_id) => {
        setIsModalOpen(true)
        setCartId(cart_id)
    }

    const BetHistoryElements = (name, i) => {
        const historyData = JSON.parse(name.cart)
   
        return (
            <div key={i} className="mb-3" clickcart="true">
            <div 
            className="card cursor-pointer border-0" 
            style={{ borderBottomRightRadius: 0, borderBottomLeftRadius: 0, borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}          
            clickcart="true"
            >
                <div 
                    className="card p-3 border-0 bg-light shadow-sm"
                    style={{ borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }}
                    onClick={(e) => openMoreMarkets(i,e)}
                    clickcart="true"
                >
                <div className='d-flex justify-content-between' clickcart="true" onClick={(e) => openMoreMarkets(i,e)}>
                    <div clickcart="true">
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
                    <div clickcart={0}>
                        <div className='btn' clickcart={0} onClick={() => openDeleteModal(name.cart_id)}>
                            <FontAwesomeIcon onClick={() => openDeleteModal(name.cart_id)} icon={faTrash} className="text-danger"/>
                        </div>
                    </div>
                </div>
                <div clickcart="true">
                    <small clickcart="true">Bet ID:</small>
                    <small clickcart="true" className='fw-bold' style={{ textTransform: 'uppercase' }}>{name.cart_id}</small> 
                </div>
                <div 
                    className={`mt-2 d-flex align-items-center justify-content-between p-2 ${name.bet_status === 'Won' && 'bg-success'} ${name.bet_status === 'Lost' && 'bg-danger'} ${name.bet_status === 'Active' && 'bg-info'} bg-secondary shadow rounded-pill text-white`}
                    clickcart="true"
               >   
                    <span style={{ paddingLeft: 12 }}>Bet Status</span>
                    <Span 
                        className={`d-flex align-items-center text-center rounded text-warning fw-bold ${name.bet_status === 'Won' && 'text-white bg-success'} ${name.bet_status === 'Lost' && 'text-white bg-danger'}`}
                        style={{ paddingRight: 12 }}
                    >
                        <span style={{ marginRight: 6 }}>
                            {name.bet_status === 'Won' && <i className="bi bi-trophy-fill" ></i>}
                            {name.bet_status === 'Lost' && <i className="bi bi-exclamation-circle text-white" ></i>}
                            {name.bet_status === 'Pending' && <i className="bi bi-hourglass-split text-white" ></i>}
                            {name.bet_status === 'Active' && <i className="bi bi-bullseye text-white" ></i>}
                        </span>
                        <span className='text-white' style={{ marginTop: 2 }}>{name.bet_status}</span>
                    </Span>                            
                </div>
                <div className='d-flex justify-content-between mt-2 p-1' clickcart="true">
                    <div clickcart="true">
                        <Span>Stake Amount: </Span>
                        <Span className="fw-bold">KES {name.bet_amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Span>
                    </div>
                    <div clickcart="true">
                        <Span>Final Payout: </Span>
                        <Span className="fw-bold">KES {name.possible_payout.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Span>
                    </div>  
                </div>
                           
            </div>
            </div>
            <div 
            className={`card p-1 border-0 history-more-markets shadow`}
            style={{ 
                borderTopRightRadius: 0, 
                borderTopLeftRadius: 0, 
                borderTop: 'none',
                display:'none',
                paddingTop: 0
            }}
            >
                {historyData.map((d,i) => {       
                    return (
                        <div className='card p-3 border-0' key={i+d.fixture_id}>
                            <div style={{ marginLeft: '.5rem', marginRight: '.5rem' }}>
                                <small>Game ID: {d.fixture_id}</small>
                                <div className='row bg-dark rounded-pill text-light p-1 m-1'>
                                    <Col style={{ maxWidth: 20 }}>
                                        <span><FontAwesomeIcon icon={faSoccerBall} /></span>
                                    </Col>
                                    <Col className="text-center">
                                        <span>{d.betslip_teams}</span>
                                    </Col>
                                </div>
                            </div>                        
                            <div className='d-flex justify-content-between mt-2' style={{ marginLeft: '.5rem', marginRight: '.5rem' }} >
                                <span>Market: {d.betslip_market}</span>
                                <span>Odds: {d.betslip_odds}</span>
                            </div>
                            <div className='d-flex justify-content-between m-2'>
                                <span>Picked: {d.betslip_picked}</span>
                                <span>Outcome: {Boolean(name.outcome) ? name.outcome : '__-__'}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
        )
    }

    return (
        <div className="bg-white pt-3 pb-3 h-100">
        
            <div>
                <Pagination 
                    data={data} 
                    setPageNumber={setPageNumber}
                    pageNumber={pageNumber}
                />
            </div> 
           
            <div className='d-flex justify-content-center mb-2'>
                <RefreshButtonElement refetch={refetch}/>
            </div>
            {data?.data.length > 0 ? 
                <div className='bg-white rounded p-2'>
                    <div className='mb-4'>                      
                        {data.data.map(BetHistoryElements) }
                    </div>

                    {data?.data.length > 0 &&  
                        <div>
                            <Pagination 
                                data={data} 
                                setPageNumber={setPageNumber}
                                pageNumber={pageNumber}
                            />
                        </div> 
                    }

                    <AlertModalElement
                        closeModal={closeModal} 
                        isModalOpen={isModalOpen}
                        action={removeSingleBetHistory}
                        cartId={cartId}
                        primaryMessage="Are you sure you want to delete this Bet?"
                        secondaryMessage="This action cannot be undone!"
                        submitBtnText="Delete"
                        cancelBtnText="Cancel"
                    />

                </div>       
            : <NoBetslipHistory/>
            }
        </div>
    )
}

const NoBetslipHistory = () => {
    const router = useRouter()
    const { his_tab } = router.query
    return (
        <>
        <div className="text-center mt-5">
            <Span className='text-dark'>
                You do not have any {his_tab === 'sbets' ? 'Sportsbook' : 'Jackpot'} bets
            </Span>
        </div>
        </>
    )
}