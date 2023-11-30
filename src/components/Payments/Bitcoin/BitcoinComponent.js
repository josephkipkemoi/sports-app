import Image from "next/image";
import React from "react";
import { Card } from "react-bootstrap";
import config from '../../../../config.json'

const BitcoinComponent = ({ displayMode }) => {
return (
    <Card className={`${displayMode === 'dark-mode' ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
    <Card.Header className="d-flex justify-content-center border-0" style={{ margin: 0, paddingTop: '1rem' }}>
        <Image src={`${config.FRONT_END_URL}bitcoin.png`} width={72} height={72} />
    </Card.Header>
    <hr className="text-secondary"/>
    <div className="p-1 text-center">
    <p>Make payment to Bitcoin address and wait at least 2 minutes before reloading your balance</p>
    <h6>Scan QR Code</h6>
    <div>
        <Image src={`${config.FRONT_END_URL}bitcoinQR.png`} width={148} height={148} />
    </div>
    <span className="text-center" style={{ letterSpacing: '2px' }}>
            <label htmlFor="bitcoin" className="mb-3 fw-bold text-center">{config.BITCOIN_DEPOSIT_ADDRESS}</label>
            <input 
                id="bitcoin"
                style={{ fontSize: '1.4rem' }} 
                className="text-center form-control" 
                type="text" 
                disabled 
                value={config.BITCOIN_DEPOSIT_ADDRESS}
            />                   
    </span>
    </div>
  
    <Card.Body style={{ paddingTop: 0 }}>
       
       
    </Card.Body>
</Card>
)
}

export default BitcoinComponent