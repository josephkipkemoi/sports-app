import React, { useEffect, useState } from "react";
import generateTimestamp from "../../../hooks/generateTimestamp";
import generateBase64Encoding from "../../../hooks/generateBase64Encoding";
import AuthUser from "../../../hooks/AuthUser";
import configData from '../../../../config.json';
import { Card, Modal } from "react-bootstrap";
import { InputNumber, Small, Span } from "../../Html";
import Image from "next/image";
import axios from "../../../lib/axios";
import styled from "styled-components";


const StyleMpesaPaybill = styled.div`
    h1 {
        letter-spacing: 4px;
    }
    h5 {
        letter-spacing: 2px;
    }
    p {
        font-size: 14px;
    }
`
const MpesaComponent = ({ displayMode }) => {
    const [authToken, setAuthToken] = useState('')

    const { uu_id } = AuthUser()
 
    const { APP_NAME, MINIMUM_DEPOSIT_AMOUNT } = configData;

    const [depositAmount, setDepositAmount] = useState(MINIMUM_DEPOSIT_AMOUNT);
    const [depositLoading, setDepositLoading] = useState(false)
    const [mpesaOpen, setMpesaOpen] = useState(false)

    const closeMpesaModal = () => setMpesaOpen(false)
    const openMpesaModal = () => setMpesaOpen(true)

    const updateDepositAmount = (e) => {
        e.preventDefault()
        const depositAmt = Number(e.target.value)
        setDepositAmount(depositAmt)
    }

    const incrementDepositAmount = (e) => {
        const incrementAmt = Number(e.target.getAttribute('inc'))
        
        if(incrementAmt === 100) {
          setDepositAmount(depositAmount + configData.INCREMENT_DEPOSIT_100)
        }
        if(incrementAmt === 250) {
          setDepositAmount(depositAmount + configData.INCREMENT_DEPOSIT_250)
        }
        if(incrementAmt === 500) {
          setDepositAmount(depositAmount + configData.INCREMENT_DEPOSIT_500)
        }
        if(incrementAmt === 1000) {
          setDepositAmount(depositAmount + configData.INCREMENT_DEPOSIT_1000)
        }
        if(incrementAmt === 5000) {
          setDepositAmount(depositAmount + configData.INCREMENT_DEPOSIT_5000)
        }
    }

    const deposit = async () => {
        setDepositLoading(true)
        const short_code = config.BUSINESS_SHORT_CODE;
        const passkey = config.BUSINESS_PASSKEY;
        const timestamp = generateTimestamp().toString();
        const phone_number = Number(uu_id.phone_number)
        const password = generateBase64Encoding(short_code, passkey, timestamp);

        if(authToken) {
           const res = await axios.post('api/mpesa/push', {
                token: authToken,
                phone_number,
                timestamp,
                amount: depositAmount         
            })

           if(res.status === 200) {
            setTimeout(() => {
                setDepositLoading(false)
            }, 3000)
           }
        }
    
    }

    const mpesaAuth = async () => {
        const res = await axios.get('api/mpesa/auth')
        if(res.status === 200) {
            setAuthToken(res.data.access_token)
        }
     
        return res
    }

    const enableDepositButton = () => setDepositLoading(false)

    useEffect(() => {
        mpesaAuth()         
    }, [])

    return (
        <Card className={`border-0 mt-3 rounded custom-active-container ${displayMode === 'dark-mode' ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
            <Card.Header className="d-flex justify-content-center border-0" style={{ margin: 0, paddingTop: '1rem', paddingBottom: '.5rem' }}>
                <Image src={`${configData.FRONT_END_URL}mpesa.png`} width={72} height={72} />
            </Card.Header>
            <Card.Body style={{ paddingTop: 0 }}>
                <Span className="d-block">Send money into your {APP_NAME} account</Span>
                <button 
                inc={configData.INCREMENT_DEPOSIT_100} 
                onClick={incrementDepositAmount} modalid="modal-ref" 
                className='custom-btn custom-notactive-btn m-1 mb-2'
                >
                + {configData.INCREMENT_DEPOSIT_100}
                </button>       
                <button 
                inc={configData.INCREMENT_DEPOSIT_250} 
                modalid="modal-ref" 
                onClick={incrementDepositAmount} 
                className='custom-btn custom-notactive-btn m-1 mb-2'
                >
                + {configData.INCREMENT_DEPOSIT_250}
                </button>       
                <button 
                inc={configData.INCREMENT_DEPOSIT_500} 
                modalid="modal-ref" 
                onClick={incrementDepositAmount} 
                className='custom-btn custom-notactive-btn m-1 mb-2'
                >
                + {configData.INCREMENT_DEPOSIT_500}
                </button>       
                <button 
                inc={configData.INCREMENT_DEPOSIT_1000} 
                modalid="modal-ref" 
                onClick={incrementDepositAmount} 
                className='custom-btn custom-notactive-btn m-1 mb-2'
                >
                + {configData.INCREMENT_DEPOSIT_1000}
                </button>      
                <button 
                inc={configData.INCREMENT_DEPOSIT_5000} 
                modalid="modal-ref" onClick={incrementDepositAmount} 
                className='custom-btn custom-notactive-btn m-1 mb-2'
                >
                + {configData.INCREMENT_DEPOSIT_5000}
                </button>   
                {depositLoading ? <Small className="d-block text-danger">
                    Check Mpesa prompt and proceed
                </Small> : ''}  
            
                <InputNumber 
                    className="d-block form-control p-3 custom-active-btn mt-2 mb-2" 
                    placeholder={depositAmount}
                    onChange={updateDepositAmount}
                    // value={depositAmount}
                />
                <Small className="d-block text-danger">
                    Minimum KES {MINIMUM_DEPOSIT_AMOUNT.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </Small>
                <div className={`text-center ${displayMode === 'dark-mode' ? 'deposit-dark-mode' : 'deposit-light-mode'}`}>
                    {/* <button className={`custom-btn custom-active-btn `} onClick={deposit} disabled={depositLoading || true}>
                        { depositLoading ? 'Loading...' : 'Deposit'}
                    </button> */}
                    <button className="btn btn-warning w-100 shadow-sm" onClick={openMpesaModal}>
                        Deposit
                    </button>
                </div>
            </Card.Body>
            <Card.Footer className="border-0">
                <span className="d-block mb-2">Having trouble?</span>
                <StyleMpesaPaybill className="text-center">
                    <h5 className="fw-bold">
                        USE PAYBILL:                  
                    </h5>
                    <h1 className="fw-bold pay-bill">
                        {configData.MPESA_PAYBILL_NUMBER}   
                    </h1>
                    <h5 className="fw-bold">
                        ACCOUNT NO:
                    </h5>
                    <h4 className="fw-bold">
                        07-XXX-XXX
                    </h4>
                    <DepositModal mpesaOpen={mpesaOpen} closeMpesaModal={closeMpesaModal}/>
                </StyleMpesaPaybill>               
            </Card.Footer>
           
        </Card>
    )
}

const DepositModal = ({ mpesaOpen, closeMpesaModal }) => {
    const [phoneNumber, setPhoneNumber] = useState("07XX-XXX-XXX")
    useEffect(() => {
        const user = localStorage.getItem('uu_id')
        setPhoneNumber(JSON.parse(user)?.uu_id?.phone_number)
    }, [mpesaOpen])
    return (
        <Modal show={mpesaOpen} centered>
            <Modal.Header className="bg-success fw-bold text-white">
               <h4 style={{ margin: 0 }}>
                    MPESA DEPOSIT
               </h4> 
            </Modal.Header>
            <Modal.Body className="bg-light">
                <StyleMpesaPaybill>
                    <p>Open Mpesa STK</p>
                    <p>Go to Lipa Na Mpesa</p>
                    <p>&gt; Pay Bill</p>
                    <p>&gt; Enter Business No: <span className="fw-bold"> {configData.MPESA_PAYBILL_NUMBER}</span>  </p>
                    <p>&gt; Account No: <span className="fw-bold">{phoneNumber}</span></p>
                    <p>&gt; Amount: (KES {configData.MINIMUM_DEPOSIT_AMOUNT}) Minimum Deposit Allowed</p>
                    <p>Enter Mpesa Pin and continue betting</p>
                </StyleMpesaPaybill>  
            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex justify-content-between w-100">
                    <button className="btn btn-danger w-100 m-1 p-2" onClick={closeMpesaModal}> 
                        Close
                    </button>                   
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default MpesaComponent