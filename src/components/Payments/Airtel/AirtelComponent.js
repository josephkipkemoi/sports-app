import React, { useState } from "react";
import config from '../../../../config.json';
import { Card } from "react-bootstrap";
import { InputNumber, Small, Span } from "../../Html";
import Image from "next/image";

const AirtelComponent = ({ displayMode }) => {
    const { APP_NAME, MINIMUM_DEPOSIT_AMOUNT } = config;
    const [depositAmount, setDepositAmount] = useState(config.MINIMUM_DEPOSIT_AMOUNT);
    const [depositLoading, setDepositLoading] = useState(false)

    const updateDepositAmount = (e) => {
        e.preventDefault()
        const depositAmt = Number(e.target.value)
        setDepositAmount(depositAmt)
    }

    const incrementDepositAmount = (e) => {
        const incrementAmt = Number(e.target.getAttribute('inc'))
        
        if(incrementAmt === 100) {
          setDepositAmount(depositAmount + config.INCREMENT_DEPOSIT_100)
        }
        if(incrementAmt === 250) {
          setDepositAmount(depositAmount + config.INCREMENT_DEPOSIT_250)
        }
        if(incrementAmt === 500) {
          setDepositAmount(depositAmount + config.INCREMENT_DEPOSIT_500)
        }
        if(incrementAmt === 1000) {
          setDepositAmount(depositAmount + config.INCREMENT_DEPOSIT_1000)
        }
        if(incrementAmt === 5000) {
          setDepositAmount(depositAmount + config.INCREMENT_DEPOSIT_5000)
        }
    }

    const deposit = async () => {
        setDepositLoading(true)
    }

    return (
        <Card className={`border-0 mt-3 rounded custom-active-container ${displayMode === 'dark-mode' ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
        <Card.Header className="d-flex justify-content-center border-0" style={{ margin: 0, paddingTop: '1rem', paddingBottom: '.5rem' }}>
            <Image src={`${config.FRONT_END_URL}airtelmoney.webp`} width={72} height={72} />
        </Card.Header>
        <Card.Body style={{ paddingTop: 0 }}>
            <Span className="d-block">Send money into your {APP_NAME} account</Span>
            <button 
            inc={config.INCREMENT_DEPOSIT_100} 
            onClick={incrementDepositAmount} modalid="modal-ref" 
            className='custom-btn custom-notactive-btn m-1 mb-2'
            >
            + {config.INCREMENT_DEPOSIT_100}
            </button>       
            <button 
            inc={config.INCREMENT_DEPOSIT_250} 
            modalid="modal-ref" 
            onClick={incrementDepositAmount} 
            className='custom-btn custom-notactive-btn m-1 mb-2'
            >
            + {config.INCREMENT_DEPOSIT_250}
            </button>       
            <button 
            inc={config.INCREMENT_DEPOSIT_500} 
            modalid="modal-ref" 
            onClick={incrementDepositAmount} 
            className='custom-btn custom-notactive-btn m-1 mb-2'
            >
            + {config.INCREMENT_DEPOSIT_500}
            </button>       
            <button 
            inc={config.INCREMENT_DEPOSIT_1000} 
            modalid="modal-ref" 
            onClick={incrementDepositAmount} 
            className='custom-btn custom-notactive-btn m-1 mb-2'
            >
            + {config.INCREMENT_DEPOSIT_1000}
            </button>      
            <button 
            inc={config.INCREMENT_DEPOSIT_5000} 
            modalid="modal-ref" onClick={incrementDepositAmount} 
            className='custom-btn custom-notactive-btn m-1 mb-2'
            >
            + {config.INCREMENT_DEPOSIT_5000}
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
                <h4>Coming Soon!</h4>
            </div>
           
        </Card.Footer>
    </Card>
    )
}

export default AirtelComponent