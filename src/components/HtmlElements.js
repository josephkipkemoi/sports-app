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
            <FontAwesomeIcon
                icon={faRefresh}
                onClick={refetch}
                className="text-white icon-status p-2"
                size='lg'
            />
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
                                <FontAwesomeIcon style={{ zIndex: 4 }} onClick={closeModal} className='float-end cursor-pointer' size="xl" icon={faTimesCircle} />
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
                    <div style={{ position: 'absolute'}}>
                        <Confetti/> 
                    </div> 
                            
                </Modal>         
    )
}

const StyleCustomSpinner = styled.div`
.lds-default {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .lds-default div {
    position: absolute;
    width: 6px;
    height: 6px;
    background: #191970;
    border-radius: 50%;
    animation: lds-default 1.2s linear infinite;
  }
  .lds-default div:nth-child(1) {
    animation-delay: 0s;
    top: 37px;
    left: 66px;
  }
  .lds-default div:nth-child(2) {
    animation-delay: -0.1s;
    top: 22px;
    left: 62px;
  }
  .lds-default div:nth-child(3) {
    animation-delay: -0.2s;
    top: 11px;
    left: 52px;
  }
  .lds-default div:nth-child(4) {
    animation-delay: -0.3s;
    top: 7px;
    left: 37px;
  }
  .lds-default div:nth-child(5) {
    animation-delay: -0.4s;
    top: 11px;
    left: 22px;
  }
  .lds-default div:nth-child(6) {
    animation-delay: -0.5s;
    top: 22px;
    left: 11px;
  }
  .lds-default div:nth-child(7) {
    animation-delay: -0.6s;
    top: 37px;
    left: 7px;
  }
  .lds-default div:nth-child(8) {
    animation-delay: -0.7s;
    top: 52px;
    left: 11px;
  }
  .lds-default div:nth-child(9) {
    animation-delay: -0.8s;
    top: 62px;
    left: 22px;
  }
  .lds-default div:nth-child(10) {
    animation-delay: -0.9s;
    top: 66px;
    left: 37px;
  }
  .lds-default div:nth-child(11) {
    animation-delay: -1s;
    top: 62px;
    left: 52px;
  }
  .lds-default div:nth-child(12) {
    animation-delay: -1.1s;
    top: 52px;
    left: 62px;
  }
  @keyframes lds-default {
    0%, 20%, 80%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.5);
    }
  }
  
`
 
export const CustomSpinner = ({ color }) => {
    return (
        <StyleCustomSpinner>
           <div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </StyleCustomSpinner>
    )
}