import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh,faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import  ProgressBar  from 'react-bootstrap/ProgressBar';
import  Modal  from 'react-bootstrap/Modal';

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
