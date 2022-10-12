import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh,faTimesCircle, faCancel, faThumbsUp, faTrophy, faCheck, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import  ProgressBar  from 'react-bootstrap/ProgressBar';
import  Modal  from 'react-bootstrap/Modal';
import styled from 'styled-components';
import { Span } from './Html';
import Link from 'next/link';
import { Card } from 'react-bootstrap';
import Confetti from './Confetti';
export const RefreshButtonElement = ({ refetch }) => {
    return (
        <button 
            className='btn btn-outline-secondary border-0 shadow-sm d-flex align-items-center m-1'
            onClick={refetch}
        >
            <FontAwesomeIcon
                icon={faRefresh}
                style={{ marginRight: 8 }}
            />
            Refresh
        </button>
    )
}

export const ProgressBarElement = ({ now, max }) => {
    return <ProgressBar animated={true} min={0} max={max} now={now} />;
}

export const AlertModalElement = ({ closeModal, isModalOpen, action, cartId, primaryMessage, secondaryMessage, submitBtnText,cancelBtnText }) => {
    return (
        <Modal show={isModalOpen} centered className="p-3">
            <Modal.Body>
                <div className="d-flex justify-content-end times">
                    <FontAwesomeIcon icon={faTimesCircle} size="lg" onClick={closeModal}/>
                </div>
                <div className='mt-4'>
                    <h4 className='fw-bold'>{primaryMessage}</h4>
                    <h6 className='text-secondary'>{secondaryMessage}</h6>
                </div>                  
                <div className="d-flex justify-content-end">
                    <button className='btn btn-light' onClick={closeModal}>{cancelBtnText}</button>
                    <button className='btn btn-danger shadow' onClick={() => action(cartId)}>{submitBtnText}</button>
                </div>              
            </Modal.Body>
        </Modal>
    )
}

export const ErrorElement = ({ message }) => {
    return (
        <div className='text-center bg-danger p-3 rounded shadow-sm text-white'>
            <FontAwesomeIcon icon={faCancel} size="5x" />
            <h2 className='m-3'>
                Error
            </h2>
            <h3>
                {message}
            </h3>
        </div>
    )
}
const StyleStars = styled.div`
.custom-1 {
  position: absolute;
  margin-top: 20px;
  margin-left: 40px;
}
.custom-2 {
  position: absolute;
  margin-top: 60px;
  left: 70px;
} 
.custom-2-1 {
  position: absolute;
  margin-top: 20px;
  right: -30px;
} 
.custom-3 {
  position: absolute;
  margin-top: 5px;
  right: 10px;
} 
.custom-4 {
  position: absolute;
  margin-top: 15px;
  right: -60px;
} 
.balloon-1 {
  position: absolute;
  margin-top: 0px;
  right: 50px;
}
.balloon-2 {
  position: absolute;
  margin-top: 60px;
  right: -80px;
}
`
const StyleCongratulationsModal = styled.div`
background: #fff;
border: none;
.congrat, .modal-content {
    background: #fff !important; 
}
h1,h2 {
  line-height: 42px;
  margin: 0;
  padding: 0;
  letter-spacing: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
h6 {
    letter-spacing: 1px;
    margin: 0;
    padding: 0;
    line-height: 24px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
button {
    letter-spacing: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
a {
  line-height: 32px;
}
.small-position {
  margin-top: 2px;
  font-size: 14px;
}
`
 
export const CongratulationModal = ({ isModalOpen, closeModal, historyRoute, market }) => {
 
        return (
                <Modal show={isModalOpen} centered className="border-0">
                    <StyleCongratulationsModal className='congrat rounded-pill bg-white p-3' >
                        <Card className='congrat rounded-pill p-2 bg-light border-0' >                       
                            <div style={{ zIndex: 4 }}>
                                <FontAwesomeIcon onClick={closeModal} className='float-end cursor-pointer' size="xl" icon={faTimesCircle} />
                            </div>                          
                            <Card.Body className='mb-2 text-center' style={{ zIndex: 5, marginTop: '-25px' }}>
                                <FontAwesomeIcon className='text-danger shadow-lg rounded-circle' icon={faCheckCircle} size="10x"/>
                            </Card.Body>
                           
                            <Card.Footer className='border-0 bg-warning text-white rounded-pill text-center shadow-lg' style={{ zIndex: 4 }}>
                                <h1 className='fw-bold'>
                                    <FontAwesomeIcon icon={faThumbsUp} style={{ marginRight: 12, color: '#fff' }} />
                                    CONGRATULATIONS
                                </h1>
                                <h6 className='fw-bold text-light'>{market} placed successfully!</h6>
                            </Card.Footer>
                            <Card.Footer className='border-0 bg-none mt-4 rounded-pill text-center' style={{ zIndex: 4 }}>
                                <div className='d-flex'>
                                    <button className='btn btn-danger shadow rounded-pill m-1 w-100  d-flex align-items-center justify-content-center' onClick={closeModal}>
                                        <i className="bi bi-hand-index-thumb" style={{ marginRight: 6 }}></i>
                                            Place Again
                                    </button>
                                    <Link href={historyRoute}>
                                        <a
                                            itemProp='url'
                                            className='btn btn-primary shadow rounded-pill m-1 w-100 d-flex align-items-center justify-content-center'
                                        >
                                            <i className="bi bi-eye" style={{ marginRight: 6 }}></i>
                                            View Betslip
                                        </a>
                                    </Link>
                                </div>                               
                            </Card.Footer>
                        </Card>
                    </StyleCongratulationsModal>   
                    <div style={{ position: 'absolute', zIndex: 1 }}>
                        <Confetti/> 
                    </div> 
                            
                </Modal>         
    )
}
 
 {/* <Span 
                            modalid="modal-ref" 
                            className='fw-bold p-2 d-block mb-2 float-end' 
                            onClick={closeModal} 
                            style={{ cursor: 'pointer', width: 32 }}
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-x-circle-fill text-light" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                            </svg>
                            </Span>  
                            <StyleStars>
                            <Stars/>
                            </StyleStars>
                            <div className='d-flex justify-content-center mt-5 pt-4 w-100' style={{ zIndex: 2 }}>
                                <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="104" height="104" 
                                fill="currentColor" 
                                className="bi bi-trophy-fill text-warning " 
                                viewBox="0 0 16 16">
                                <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z"/>
                                </svg>
                            </div>
                            <StyleCongratulationsModalMidMenu className='text-center mt-3 mb-3'>
                            <h1 modalid="modal-ref" className='fw-bold text-light'>Congratulations!</h1>
                            <h3 className='mt-2 mb-4 text-light'>
                                {market} placed successfully!
                            </h3>
                            <div className='d-flex'>
                                <Link href='#'>
                                <a
                                    itemProp='url'
                                    className='btn btn-light w-100 mt-2 m-1 shadow-lg d-flex justify-content-center'
                                >
                                    <i className="bi bi-share" style={{ marginRight: 5 }}></i>
                                    <small className='small-position'>Share</small>
                                </a>
                                </Link>
                                <Link href={historyRoute}>
                                <a
                                    itemProp='url'
                                    className='btn btn-warning w-100 mt-2 m-1 shadow-lg d-flex justify-content-center'
                                >
                                    <i className="bi bi-card-list" style={{ marginRight: 5 }}></i>
                                    <small className='small-position'>View Bet</small>               
                                </a>
                            </Link>
                            </div>
                            
                            </StyleCongratulationsModalMidMenu> */}