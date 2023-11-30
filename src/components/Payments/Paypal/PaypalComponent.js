import Image from "next/image";
import React from "react";
import { Card } from "react-bootstrap";
import config from '../../../../config.json'
import { Small } from "../../Html";

const PaypalComponent = ({ displayMode }) => {
 return (
    <Card className={`border-0 shadow mt-3 rounded ${displayMode === 'dark-mode' ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
    <Card.Header className="d-flex justify-content-center bg-light border-0" style={{ margin: 0, paddingTop: '1rem', paddingBottom: '.5rem' }}>
        <Image src={`${config.FRONT_END_URL}paypallogo.png`} width={148} height={56} />
    </Card.Header>
    <Card.Body style={{ paddingTop: 0 }}>
        <hr className="text-secondary"/>
        <div className="text-center m-3 fw-bold">
            <p>Make payment to paypal email address and wait at least 2 minutes before reloading your balance</p>
            <h5 className="text-center" style={{ letterSpacing: '2px' }}>
                <label htmlFor="paypal" className="mb-3 fw-bold">Email: cynkemltd@gmail.com</label>
                <input 
                    id="paypal"
                    style={{ fontSize: '1.4rem' }} 
                    className="text-center form-control" 
                    type="text" 
                    disabled 
                    value=" cynkemltd@gmail.com" 
                />                   
            </h5>
        </div>
        <Small className="d-block text-danger text-center fw-bold">
            Minimum USD 10.00
        </Small>      
    </Card.Body>

</Card>
 )
}

export default PaypalComponent