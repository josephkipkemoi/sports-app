import React, { useEffect, useState } from "react";
import generateTimestamp from "../../../hooks/generateTimestamp";
import generateBase64Encoding from "../../../hooks/generateBase64Encoding";
import AuthUser from "../../../hooks/AuthUser";
import configData from '../../../../config.json';
import { Card } from "react-bootstrap";
import { InputNumber, Small, Span } from "../../Html";
import Image from "next/image";
import axios from "../../../lib/axios";

const MpesaComponent = ({ displayMode }) => {
    const [authToken, setAuthToken] = useState('')

    const { uu_id } = AuthUser()
 
    const { APP_NAME, MINIMUM_DEPOSIT_AMOUNT } = configData;

    const [depositAmount, setDepositAmount] = useState(configData.MINIMUM_DEPOSIT_AMOUNT);
    const [depositLoading, setDepositLoading] = useState(false)

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
                    value={depositAmount}
                />
                <Small className="d-block text-danger">
                    Minimum KES {MINIMUM_DEPOSIT_AMOUNT.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </Small>
                <div className={`text-center ${displayMode === 'dark-mode' ? 'deposit-dark-mode' : 'deposit-light-mode'}`}>
                    <button className={`custom-btn custom-active-btn `} onClick={deposit} disabled={depositLoading || true}>
                        { depositLoading ? 'Loading...' : 'Deposit'}
                    </button>
                </div>
            </Card.Body>
            <Card.Footer className="border-0">
                <span className="d-block mb-2">Having trouble?</span>
                <div className="text-center">
                    <h6 className="fw-bold">
                        USE PAYBILL: {configData.MPESA_PAYBILL_NUMBER}                    
                    </h6>
                    <h6 className="fw-bold">
                        ACCOUNT NO: 07-XXX-XXX
                    </h6>
                </div>
               
            </Card.Footer>
        </Card>
    )
}


export default MpesaComponent